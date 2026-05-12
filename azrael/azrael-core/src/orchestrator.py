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
            # All auto actions allowed for critical threats
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
