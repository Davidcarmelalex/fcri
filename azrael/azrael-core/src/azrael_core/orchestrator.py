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
from copy import deepcopy

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


@dataclass(frozen=True)
class ResponsePlan:
    """Side-effect-free proposal; execute only after policy authorization."""

    event_id: str
    action: ResponseAction
    target: str
    rationale: str
    policy_ref: str


@dataclass(frozen=True)
class AuditRecord:
    event_id: str
    agent_id: str
    status: str
    action: ResponseAction | None = None
    error: str | None = None
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class DefenseAgent(Protocol):
    """Protocol for all AZRAEL defense agents."""
    
    @property
    def agent_id(self) -> str: ...
    
    @property
    def capabilities(self) -> list[str]: ...
    
    async def plan(self, event: ThreatEvent) -> ResponsePlan | None:
        """Describe an action without performing it."""
        ...

    async def execute(self, plan: ResponsePlan) -> bool:
        """Execute the exact authorized proposal and return success."""
        ...


class AuthorizationMode(Enum):
    AUTOMATIC = "automatic"
    APPROVAL_REQUIRED = "approval_required"
    DENIED = "denied"

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


class PolicyEngine:
    """
    Authorizes response actions based on configured policies.
    All automated responses must pass policy authorization.
    """
    
    def __init__(self, policies: dict[str, list[str]] | None = None,
                 *, critical_override: bool = True, version: str = "1"):
        self.version = version
        self.critical_override = critical_override
        self._policies = policies if policies is not None else {
            "auto": [ResponseAction.ALERT.value, ResponseAction.REPORT.value],
            "supervised": [ResponseAction.ISOLATE.value, ResponseAction.BLOCK.value],
            "manual": [ResponseAction.QUARANTINE.value],
        }
    
    def authorize(self, action: ResponseAction, threat_level: ThreatLevel) -> bool:
        """True only for automatic actions; approval-required is not permission."""
        return self.mode(action, threat_level) is AuthorizationMode.AUTOMATIC

    def mode(self, action: ResponseAction, threat_level: ThreatLevel) -> AuthorizationMode:
        if threat_level == ThreatLevel.CRITICAL and self.critical_override:
            return AuthorizationMode.AUTOMATIC
        if action.value in self._policies.get("auto", []):
            return AuthorizationMode.AUTOMATIC
        if action.value in self._policies.get("supervised", []) or action.value in self._policies.get("manual", []):
            return AuthorizationMode.APPROVAL_REQUIRED
        return AuthorizationMode.DENIED


class AzraelOrchestrator:
    """
    Core AZRAEL orchestrator.
    
    Receives threat events from the sense layer,
    routes them through policy authorization,
    delegates to response agents,
    and triggers the heal layer on recovery.
    """
    
    def __init__(self, policy_engine: PolicyEngine | None = None, *,
                 allowed_approval_roles: set[str] | None = None):
        self._agents: list[DefenseAgent] = []
        self._policy = policy_engine or PolicyEngine()
        self._event_queue: asyncio.Queue[ThreatEvent] = asyncio.Queue()
        self._running = False
        self._audit: list[AuditRecord] = []
        self._attempted: set[tuple[str, str]] = set()
        self.audit = InMemoryAudit()
        self._claims: set[str] = set()
        self._used_approvals: set[str] = set()
        self._kill_switch = False
        self.allowed_approval_roles = set(allowed_approval_roles) if allowed_approval_roles is not None else {"responder", "admin"}
        self._proposals: dict[str, ResponseProposal] = {}
        self._proposal_severity: dict[str, ThreatLevel] = {}
        self._approvals: dict[str, OperatorApproval] = {}
        self._revoked_approvals: set[str] = set()
    
    def propose(self, event: ThreatEvent, response: DefenseResponse,
                *, incident_id: str | None = None, ttl: timedelta = timedelta(minutes=5)) -> ResponseProposal:
        if response.event_id != event.id or not isinstance(response.action, ResponseAction):
            raise ValueError("Response must match the event and use a valid action")
        if not isinstance(event.severity, ThreatLevel):
            raise ValueError("Invalid event severity")
        if ttl <= timedelta(0) or not response.target.strip() or not response.rationale.strip():
            raise ValueError("Proposal requires a positive TTL, target, and rationale")
        mode = self._policy.mode(response.action, event.severity)
        proposal = ResponseProposal(str(uuid.uuid4()), incident_id or event.id, event.id,
                                    response.action, response.target, response.rationale,
                                    self._policy.version, mode, datetime.now(timezone.utc) + ttl)
        self._proposals[proposal.proposal_id] = proposal
        self._proposal_severity[proposal.proposal_id] = event.severity
        self.audit.append("proposal_created", proposal_id=proposal.proposal_id,
                          incident_id=proposal.incident_id, mode=mode.value)
        return proposal

    def _validate_proposal(self, proposal: ResponseProposal) -> None:
        if not isinstance(proposal, ResponseProposal) or self._proposals.get(proposal.proposal_id) != proposal:
            raise PermissionError("Unknown or modified proposal")
        if proposal.expires_at <= datetime.now(timezone.utc):
            raise PermissionError("Proposal has expired")
        current_mode = self._policy.mode(proposal.action, self._proposal_severity[proposal.proposal_id])
        if proposal.policy_version != self._policy.version or proposal.mode is not current_mode:
            raise PermissionError("Policy changed; create a new proposal")

    def approve(self, proposal: ResponseProposal, *, operator_id: str, role: str,
                ttl: timedelta = timedelta(minutes=5)) -> OperatorApproval:
        self._validate_proposal(proposal)
        if proposal.mode is AuthorizationMode.DENIED or role not in self.allowed_approval_roles:
            raise PermissionError("Policy or operator role cannot approve this response")
        if not operator_id.strip() or ttl <= timedelta(0):
            raise ValueError("Approval requires an operator ID and positive TTL")
        approval = OperatorApproval(str(uuid.uuid4()), proposal.proposal_id, operator_id, role,
                                    proposal.incident_id, proposal.event_id, proposal.action,
                                    proposal.target, proposal.policy_version,
                                    min(proposal.expires_at, datetime.now(timezone.utc) + ttl))
        self._approvals[approval.approval_id] = approval
        self.audit.append("approval_granted", approval_id=approval.approval_id,
                          proposal_id=proposal.proposal_id, operator_id=operator_id)
        return approval

    def revoke_approval(self, approval_id: str) -> None:
        if approval_id not in self._approvals:
            raise ValueError("Unknown approval")
        self._revoked_approvals.add(approval_id)
        self.audit.append("approval_revoked", approval_id=approval_id)

    async def execute(self, proposal: ResponseProposal, executor: Executor,
                      *, approval: OperatorApproval | None = None,
                      timeout: float = 30.0, dry_run: bool = False) -> DefenseResponse:
        try:
            self._validate_proposal(proposal)
            if self._kill_switch:
                raise PermissionError("Operator kill switch is active")
            if proposal.mode is AuthorizationMode.DENIED:
                raise PermissionError("Proposal is denied by policy")
            if timeout <= 0:
                raise ValueError("Timeout must be positive")
            if proposal.proposal_id in self._claims:
                raise PermissionError("Proposal has already been claimed")
            if proposal.mode is AuthorizationMode.APPROVAL_REQUIRED:
                if not isinstance(approval, OperatorApproval) or self._approvals.get(approval.approval_id) != approval:
                    raise PermissionError("An issued operator approval is required")
                if approval.approval_id in self._used_approvals or approval.approval_id in self._revoked_approvals:
                    raise PermissionError("Approval is used or revoked")
                if approval.revoked or approval.expires_at <= datetime.now(timezone.utc):
                    raise PermissionError("Approval is expired or revoked")
                if approval.role not in self.allowed_approval_roles:
                    raise PermissionError("Operator role is no longer allowed")
                if (approval.proposal_id, approval.incident_id, approval.event_id, approval.action,
                    approval.target, approval.policy_version) != (
                    proposal.proposal_id, proposal.incident_id, proposal.event_id, proposal.action,
                    proposal.target, proposal.policy_version):
                    raise PermissionError("Approval does not match proposal")
        except (PermissionError, ValueError) as exc:
            self.audit.append("execution_denied", proposal_id=getattr(proposal, "proposal_id", None), reason=str(exc))
            raise
        if dry_run:
            self.audit.append("execution_dry_run", proposal_id=proposal.proposal_id)
            return DefenseResponse(proposal.event_id, proposal.action, proposal.target,
                                   proposal.rationale, proposal.policy_version, success=True)
        # There is no await between validation and claiming/consuming approval.
        self._claims.add(proposal.proposal_id)
        if proposal.mode is AuthorizationMode.APPROVAL_REQUIRED:
            self._used_approvals.add(approval.approval_id)
        self.audit.append("execution_claimed", proposal_id=proposal.proposal_id)
        try:
            result = await asyncio.wait_for(executor.execute(proposal), timeout=timeout)
            if not isinstance(result, DefenseResponse) or type(result.success) is not bool:
                raise ValueError("Executor must return a DefenseResponse with boolean success")
            if (result.event_id, result.action, result.target, result.policy_ref) != (
                    proposal.event_id, proposal.action, proposal.target, proposal.policy_version):
                raise ValueError("Executor result does not match the authorized proposal")
        except asyncio.CancelledError:
            self.audit.append("execution_cancelled", proposal_id=proposal.proposal_id)
            raise
        except Exception as exc:
            self.audit.append("execution_failed", proposal_id=proposal.proposal_id, error=str(exc))
            raise
        self.audit.append("execution_completed", proposal_id=proposal.proposal_id, success=result.success)
        return result

    def set_kill_switch(self, active: bool) -> None:
        if type(active) is not bool:
            raise ValueError("Kill switch requires bool")
        self._kill_switch = active
        self.audit.append("kill_switch_changed", active=active)

    def get_pending_proposals(self) -> list[ResponseProposal]:
        return [p for p in self._proposals.values()
                if p.mode is AuthorizationMode.APPROVAL_REQUIRED
                and p.proposal_id not in self._claims
                and p.expires_at > datetime.now(timezone.utc)]

    def register_agent(self, agent: DefenseAgent) -> None:
        if not isinstance(agent.agent_id, str) or not agent.agent_id:
            raise ValueError("Agent must have a nonempty string agent_id")
        if any(a.agent_id == agent.agent_id for a in self._agents):
            raise ValueError(f"Duplicate agent_id: {agent.agent_id}")
        if not callable(getattr(agent, "plan", None)) or not callable(getattr(agent, "execute", None)):
            raise TypeError("Agents must implement plan() and execute(); migrate legacy handle() agents")
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
        # Planning receives a copy: it cannot escalate the severity used by policy.
        original = deepcopy(event)
        for agent in self._agents:
            key = (original.id, agent.agent_id)
            plan = None
            try:
                if key in self._attempted:
                    self._record(original.id, agent.agent_id, "duplicate")
                    continue
                plan = await agent.plan(deepcopy(original))
                if plan is None:
                    continue
                if not isinstance(plan, ResponsePlan):
                    raise ValueError("Agent must return ResponsePlan or None")
                if plan.event_id != original.id or not isinstance(plan.action, ResponseAction):
                    raise ValueError("Proposal has a mismatched event or invalid action")
                if not all(isinstance(value, str) and value.strip() for value in
                           (plan.target, plan.rationale, plan.policy_ref)):
                    raise ValueError("Proposal requires target, rationale, and policy_ref")
                proposal = self.propose(original, DefenseResponse(
                    plan.event_id, plan.action, plan.target, plan.rationale, plan.policy_ref))
                if proposal.mode is not AuthorizationMode.AUTOMATIC:
                    self._record(original.id, agent.agent_id,
                                 "approval_required" if proposal.mode is AuthorizationMode.APPROVAL_REQUIRED else "denied", plan.action)
                    continue
                # Recheck after awaiting plan: concurrent processing may have claimed it.
                if key in self._attempted:
                    self._record(original.id, agent.agent_id, "duplicate", plan.action)
                    continue
                self._attempted.add(key)
                self._record(original.id, agent.agent_id, "authorized", plan.action)
                class AgentExecutor:
                    async def execute(self, authorized: ResponseProposal) -> DefenseResponse:
                        success = await agent.execute(plan)
                        if type(success) is not bool:
                            raise TypeError("execute() must return bool")
                        return DefenseResponse(
                            authorized.event_id, authorized.action, authorized.target,
                            authorized.rationale, authorized.policy_version,
                            success=success, error=None if success else "Executor reported failure")
                response = await self.execute(proposal, AgentExecutor())
                success = response.success
                responses.append(response)
                self._record(original.id, agent.agent_id,
                             "succeeded" if success else "failed", plan.action, response.error)
            except asyncio.CancelledError:
                self._record(original.id, agent.agent_id, "cancelled",
                             plan.action if isinstance(plan, ResponsePlan) else None)
                raise
            except Exception as e:
                self._record(original.id, agent.agent_id, "error",
                             plan.action if isinstance(plan, ResponsePlan) else None, str(e))
        
        event.handled = event.handled or any(response.success for response in responses)
        return responses

    def _record(self, event_id: str, agent_id: str, status: str,
                action: ResponseAction | None = None, error: str | None = None) -> None:
        self._audit.append(AuditRecord(event_id, agent_id, status, action, error))
        logger.info("event=%s agent=%s status=%s action=%s error=%s",
                    event_id, agent_id, status, action, error)

    def get_audit_log(self) -> list[AuditRecord]:
        """Return a snapshot of this process's in-memory audit history."""
        return list(self._audit)
