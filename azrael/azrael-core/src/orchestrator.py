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


class DefenseAgent(Protocol):
    """Protocol for all AZRAEL defense agents."""
    
    @property
    def agent_id(self) -> str: ...
    
    @property
    def capabilities(self) -> list[str]: ...
    
    async def handle(self, event: ThreatEvent) -> DefenseResponse | None: ...


class PolicyEngine:
    """Fail-closed authorization for proposed defensive actions.

    Severity is evidence about a threat, never a permission grant.
    Disruptive operations require an explicit per-action officer approval,
    even when an incident is CRITICAL. Execution services must independently
    verify authorization immediately before applying a change.
    """

    SAFE_ACTIONS = frozenset({ResponseAction.ALERT, ResponseAction.REPORT})
    SUPERVISED_ACTIONS = frozenset({
        ResponseAction.ISOLATE, ResponseAction.BLOCK,
        ResponseAction.QUARANTINE, ResponseAction.RESTORE,
    })

    def __init__(self, policies: dict[str, list[str]] | None = None):
        self._policies = policies or {
            "auto": ["alert", "report"],
            "supervised": ["isolate", "block", "quarantine", "restore"],
        }

    def authorize(
        self,
        action: ResponseAction,
        threat_level: ThreatLevel,
        *,
        approved: bool = False,
        scope_valid: bool = False,
    ) -> bool:
        """Approve only explicitly scoped actions; fail closed by default.

        This is a minimal safety fix, not a complete signed-approval system.
        A production authorization gateway must verify officer identity,
        target, time-to-live, scope and replay protection server-side.
        """
        if action in self.SAFE_ACTIONS:
            return action.value in self._policies.get("auto", [])
        if action in self.SUPERVISED_ACTIONS:
            return (
                approved
                and scope_valid
                and action.value in self._policies.get("supervised", [])
            )
        return False


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
