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
from datetime import datetime
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
    timestamp: datetime = field(default_factory=datetime.utcnow)
    handled: bool = False


@dataclass
class DefenseResponse:
    event_id: str
    action: ResponseAction
    target: str
    rationale: str
    policy_ref: str
    timestamp: datetime = field(default_factory=datetime.utcnow)
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
    timestamp: datetime = field(default_factory=datetime.utcnow)


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


class PolicyEngine:
    """
    Authorizes response actions based on configured policies.
    All automated responses must pass policy authorization.
    """
    
    def __init__(self, policies: dict[str, list[str]] | None = None):
        self._policies = policies or {
            "auto": [ResponseAction.ALERT.value, ResponseAction.REPORT.value],
            "supervised": [ResponseAction.ISOLATE.value, ResponseAction.BLOCK.value],
            "manual": [ResponseAction.QUARANTINE.value],
        }
    
    def authorize(self, action: ResponseAction, threat_level: ThreatLevel) -> bool:
        """Returns True if the action is authorized for the given threat level."""
        if threat_level == ThreatLevel.CRITICAL:
            # Legacy policy permits every action at critical severity.
            return True
        if threat_level == ThreatLevel.HIGH:
            return action.value in self._policies.get("supervised", []) + self._policies.get("auto", [])
        return action.value in self._policies.get("auto", [])


class AzraelOrchestrator:
    """
    Core AZRAEL orchestrator.
    
    Receives threat events from the sense layer,
    routes them through policy authorization,
    delegates to response agents,
    and triggers the heal layer on recovery.
    """
    
    def __init__(self, policy_engine: PolicyEngine | None = None):
        self._agents: list[DefenseAgent] = []
        self._policy = policy_engine or PolicyEngine()
        self._event_queue: asyncio.Queue[ThreatEvent] = asyncio.Queue()
        self._running = False
        self._audit: list[AuditRecord] = []
        self._attempted: set[tuple[str, str]] = set()
    
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
                if not self._policy.authorize(plan.action, original.severity):
                    self._record(original.id, agent.agent_id, "denied", plan.action)
                    continue
                # Recheck after awaiting plan: concurrent processing may have claimed it.
                if key in self._attempted:
                    self._record(original.id, agent.agent_id, "duplicate", plan.action)
                    continue
                self._attempted.add(key)
                self._record(original.id, agent.agent_id, "authorized", plan.action)
                success = await agent.execute(plan)
                if type(success) is not bool:
                    raise TypeError("execute() must return bool")
                response = DefenseResponse(
                    event_id=plan.event_id, action=plan.action, target=plan.target,
                    rationale=plan.rationale, policy_ref=plan.policy_ref,
                    success=success, error=None if success else "Executor reported failure",
                )
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
