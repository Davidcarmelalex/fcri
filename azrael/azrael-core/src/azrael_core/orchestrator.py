"""
AZRAEL Core — Orchestration Engine

Coordinates the defense agent mesh: sense, respond, heal.
All response playbooks require explicit policy authorization.
"""
from __future__ import annotations
import asyncio
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Protocol
from datetime import datetime, timezone, timedelta
import uuid

logger = logging.getLogger("azrael.core")


class ThreatLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ResponseAction(Enum):
    ALERT = "alert"
    ISOLATE = "isolate"
    BLOCK = "block"
    QUARANTINE = "quarantine"
    RESTORE = "restore"
    REPORT = "report"


class AuthorizationMode(Enum):
    AUTOMATIC = "automatic"
    APPROVAL_REQUIRED = "approval_required"
    DENIED = "denied"


@dataclass
class ThreatEvent:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    source: str = ""
    event_type: str = ""
    severity: ThreatLevel = ThreatLevel.LOW
    payload: dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    handled: bool = False


@dataclass
class DefenseResponse:
    event_id: str
    action: ResponseAction
    target: str
    rationale: str
    policy_ref: str
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    success: bool = False
    error: str | None = None


class DefenseAgent(Protocol):
    """Protocol for all AZRAEL defense agents."""
    
    @property
    def agent_id(self) -> str: ...
    
    @property
    def capabilities(self) -> list[str]: ...
    
    async def handle(self, event: ThreatEvent) -> DefenseResponse | None: ...


class PolicyEngine:
    """
    Authorizes response actions based on configured policies.
    All automated responses must pass policy authorization.
    """
    
    def __init__(self, policies: dict[str, list[str]] | None = None,
                 *, critical_override: bool = True, version: str = "1"):
        self.version = version
        self.critical_override = critical_override
        self._policies = policies or {
            "auto": [ResponseAction.ALERT.value, ResponseAction.REPORT.value],
            "supervised": [ResponseAction.ISOLATE.value, ResponseAction.BLOCK.value],
            "manual": [ResponseAction.QUARANTINE.value],
        }
    
    def authorize(self, action: ResponseAction, threat_level: ThreatLevel) -> bool:
        """Returns True if the action is authorized for the given threat level."""
        if threat_level == ThreatLevel.CRITICAL and self.critical_override:
            # Compatibility behavior: the existing critical override is explicit.
            return True
        if threat_level == ThreatLevel.HIGH:
            return action.value in self._policies.get("supervised", []) + self._policies.get("auto", [])
        return action.value in self._policies.get("auto", [])

    def mode(self, action: ResponseAction, threat_level: ThreatLevel) -> AuthorizationMode:
        if threat_level == ThreatLevel.CRITICAL and self.critical_override:
            return AuthorizationMode.AUTOMATIC
        if action.value in self._policies.get("auto", []):
            return AuthorizationMode.AUTOMATIC
        if action.value in self._policies.get("supervised", []) or action.value in self._policies.get("manual", []):
            return AuthorizationMode.APPROVAL_REQUIRED
        return AuthorizationMode.DENIED


@dataclass(frozen=True)
class ResponseProposal:
    proposal_id: str
    incident_id: str
    event_id: str
    action: ResponseAction
    target: str
    rationale: str
    policy_version: str
    mode: AuthorizationMode
    expires_at: datetime


@dataclass(frozen=True)
class OperatorApproval:
    approval_id: str
    proposal_id: str
    operator_id: str
    role: str
    incident_id: str
    event_id: str
    action: ResponseAction
    target: str
    policy_version: str
    expires_at: datetime
    revoked: bool = False


class Executor(Protocol):
    async def execute(self, proposal: ResponseProposal) -> DefenseResponse: ...


class InMemoryAudit:
    """Small reference audit sink; production storage must implement this boundary."""
    def __init__(self) -> None:
        self.records: list[dict[str, Any]] = []

    def append(self, event: str, **details: Any) -> None:
        self.records.append({"event": event, "timestamp": datetime.now(timezone.utc), **details})


class AzraelOrchestrator:
    """
    Core AZRAEL orchestrator.
    
    Receives threat events from the sense layer,
    routes them through policy authorization,
    delegates to response agents,
    and triggers the heal layer on recovery.
    """
    
    def __init__(self, policy_engine: PolicyEngine | None = None,
                 audit: InMemoryAudit | None = None,
                 *, allowed_approval_roles: set[str] | None = None):
        self._agents: list[DefenseAgent] = []
        self._policy = policy_engine or PolicyEngine()
        self._event_queue: asyncio.Queue[ThreatEvent] = asyncio.Queue()
        self._running = False
        self.audit = audit or InMemoryAudit()
        self._claims: set[str] = set()
        self._used_approvals: set[str] = set()
        self._kill_switch = False
        self.allowed_approval_roles = allowed_approval_roles or {"responder", "admin"}

    def propose(self, event: ThreatEvent, response: DefenseResponse,
                *, incident_id: str | None = None, ttl: timedelta = timedelta(minutes=5)) -> ResponseProposal:
        mode = self._policy.mode(response.action, event.severity)
        proposal = ResponseProposal(
            proposal_id=str(uuid.uuid4()), incident_id=incident_id or event.id,
            event_id=event.id, action=response.action, target=response.target,
            rationale=response.rationale, policy_version=self._policy.version,
            mode=mode, expires_at=datetime.now(timezone.utc) + ttl)
        self.audit.append("proposal_created", proposal_id=proposal.proposal_id,
                          incident_id=proposal.incident_id, action=proposal.action.value,
                          mode=proposal.mode.value, policy_version=proposal.policy_version)
        return proposal

    def approve(self, proposal: ResponseProposal, *, operator_id: str, role: str,
                ttl: timedelta = timedelta(minutes=5)) -> OperatorApproval:
        if proposal.mode is AuthorizationMode.DENIED:
            raise PermissionError("proposal is denied by policy")
        if role not in self.allowed_approval_roles:
            raise PermissionError("operator role cannot approve responses")
        approval = OperatorApproval(
            approval_id=str(uuid.uuid4()), proposal_id=proposal.proposal_id,
            operator_id=operator_id, role=role, incident_id=proposal.incident_id,
            event_id=proposal.event_id, action=proposal.action,
            target=proposal.target, policy_version=proposal.policy_version,
            expires_at=min(proposal.expires_at, datetime.now(timezone.utc) + ttl))
        self.audit.append("approval_granted", approval_id=approval.approval_id,
                          proposal_id=proposal.proposal_id, operator_id=operator_id)
        return approval

    async def execute(self, proposal: ResponseProposal, executor: Executor,
                      *, approval: OperatorApproval | None = None,
                      timeout: float = 30.0, dry_run: bool = False) -> DefenseResponse:
        now = datetime.now(timezone.utc)
        if self._kill_switch:
            self.audit.append("execution_denied", proposal_id=proposal.proposal_id, reason="kill_switch")
            raise PermissionError("operator kill switch is active")
        if proposal.mode is AuthorizationMode.DENIED:
            self.audit.append("execution_denied", proposal_id=proposal.proposal_id, reason="policy")
            raise PermissionError("proposal is denied by policy")
        if proposal.mode is AuthorizationMode.APPROVAL_REQUIRED:
            if approval is None:
                self.audit.append("execution_denied", proposal_id=proposal.proposal_id, reason="approval_required")
                raise PermissionError("operator approval required")
            if approval.approval_id in self._used_approvals:
                raise PermissionError("approval has already been used")
            if approval.revoked or approval.expires_at <= now or proposal.expires_at <= now:
                raise PermissionError("approval is expired or revoked")
            if (approval.proposal_id, approval.incident_id, approval.event_id, approval.action,
                approval.target, approval.policy_version) != (
                proposal.proposal_id, proposal.incident_id, proposal.event_id, proposal.action,
                proposal.target, proposal.policy_version):
                raise PermissionError("approval does not match proposal")
            self._used_approvals.add(approval.approval_id)
        if dry_run:
            self.audit.append("execution_dry_run", proposal_id=proposal.proposal_id)
            return DefenseResponse(proposal.event_id, proposal.action, proposal.target,
                                   proposal.rationale, proposal.policy_version, success=True)
        if proposal.proposal_id in self._claims:
            raise RuntimeError("proposal has already been claimed")
        self._claims.add(proposal.proposal_id)
        self.audit.append("execution_claimed", proposal_id=proposal.proposal_id)
        try:
            result = await asyncio.wait_for(executor.execute(proposal), timeout=timeout)
        except asyncio.CancelledError:
            self.audit.append("execution_cancelled", proposal_id=proposal.proposal_id)
            raise
        except Exception as exc:
            self.audit.append("execution_failed", proposal_id=proposal.proposal_id, error=str(exc))
            raise
        self.audit.append("execution_completed", proposal_id=proposal.proposal_id, success=result.success)
        return result

    def set_kill_switch(self, active: bool) -> None:
        self._kill_switch = active
        self.audit.append("kill_switch_changed", active=active)
    
    def register_agent(self, agent: DefenseAgent) -> None:
        self._agents.append(agent)
        logger.info(f"Registered agent: {agent.agent_id} ({agent.capabilities})")
    
    async def ingest(self, event: ThreatEvent) -> None:
        """Ingest a threat event into the processing queue."""
        logger.info(f"Ingesting event {event.id} | {event.event_type} | {event.severity.value}")
        await self._event_queue.put(event)
    
    async def start(self) -> None:
        """Start the orchestration loop."""
        self._running = True
        logger.info("AZRAEL orchestrator started")
        while self._running:
            try:
                event = await asyncio.wait_for(self._event_queue.get(), timeout=1.0)
                await self._process(event)
            except asyncio.TimeoutError:
                continue
    
    async def stop(self) -> None:
        self._running = False
        logger.info("AZRAEL orchestrator stopped")
    
    async def _process(self, event: ThreatEvent) -> list[DefenseResponse]:
        responses: list[DefenseResponse] = []
        for agent in self._agents:
            try:
                response = await agent.handle(event)
                if response:
                    if self._policy.authorize(response.action, event.severity):
                        responses.append(response)
                        logger.info(f"Response authorized: {response.action.value} on {response.target}")
                    else:
                        logger.warning(
                            f"Response blocked by policy: {response.action.value} "
                            f"for threat level {event.severity.value}"
                        )
            except Exception as e:
                logger.error(f"Agent {agent.agent_id} failed on event {event.id}: {e}")
        
        event.handled = len(responses) > 0
        return responses
