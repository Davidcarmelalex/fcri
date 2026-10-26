"""
AZRAEL Core — Autonomous Cyber Defense Stack

An open-source self-healing cyber resilience initiative under FCRI.

Modules:
    orchestrator: Central coordination engine
    sense: Threat detection and event normalization
    heal: Self-healing and recovery operations

Usage:
    from azrael_core import AzraelOrchestrator, PolicyEngine, SenseLayer, HealLayer
"""

from .orchestrator import (
    AzraelOrchestrator,
    PolicyEngine,
    ThreatEvent,
    ThreatLevel,
    ResponseAction,
    DefenseResponse,
)
from .sense import SenseLayer, EventNormalizer, EventIngester
from .heal import HealLayer, SystemSnapshot, RecoveryAction

__version__ = "0.1.0"
__all__ = [
    "AzraelOrchestrator",
    "PolicyEngine",
    "ThreatEvent",
    "ThreatLevel",
    "ResponseAction",
    "DefenseResponse",
    "SenseLayer",
    "EventNormalizer",
    "EventIngester",
    "HealLayer",
    "SystemSnapshot",
    "RecoveryAction",
]
