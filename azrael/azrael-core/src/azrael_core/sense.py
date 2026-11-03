"""
AZRAEL Sense — Threat Detection Layer

Ingests and normalizes telemetry from multiple sources:
- System logs
- Network events
- File integrity checks
- API anomalies
"""
from __future__ import annotations
import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import AsyncIterator
from .orchestrator import ThreatEvent, ThreatLevel

logger = logging.getLogger("azrael.sense")


@dataclass
class RawEvent:
    source: str
    raw_data: dict
    timestamp: float


class EventIngester(ABC):
    """Base class for all telemetry ingesters."""
    
    @property
    @abstractmethod
    def source_id(self) -> str: ...
    
    @abstractmethod
    async def stream(self) -> AsyncIterator[RawEvent]: ...


class EventNormalizer:
    """
    Normalizes raw events from various sources into ThreatEvent format.
    Applies severity scoring based on configurable rules.
    """
    
    def normalize(self, raw: RawEvent) -> ThreatEvent | None:
        try:
            severity = self._score(raw)
            return ThreatEvent(
                source=raw.source,
                event_type=raw.raw_data.get("type", "unknown"),
                severity=severity,
                payload=raw.raw_data,
            )
        except Exception as e:
            logger.error(f"Normalization failed for {raw.source}: {e}")
            return None
    
    def _score(self, raw: RawEvent) -> ThreatLevel:
        """Heuristic severity scoring — replace with ML model in production."""
        data = raw.raw_data
        if data.get("critical") or data.get("severity") == "critical":
            return ThreatLevel.CRITICAL
        if data.get("severity") == "high" or data.get("attack_detected"):
            return ThreatLevel.HIGH
        if data.get("severity") == "medium" or data.get("anomaly"):
            return ThreatLevel.MEDIUM
        return ThreatLevel.LOW


class SenseLayer:
    """
    Coordinates all ingesters and feeds normalized events
    to the orchestrator.
    """
    
    def __init__(self, normalizer: EventNormalizer | None = None):
        self._ingesters: list[EventIngester] = []
        self._normalizer = normalizer or EventNormalizer()
    
    def register(self, ingester: EventIngester) -> None:
        self._ingesters.append(ingester)
    
    async def start(self, on_event) -> None:
        tasks = [self._run_ingester(i, on_event) for i in self._ingesters]
        await asyncio.gather(*tasks)
    
    async def _run_ingester(self, ingester: EventIngester, on_event) -> None:
        async for raw in ingester.stream():
            event = self._normalizer.normalize(raw)
            if event:
                await on_event(event)
