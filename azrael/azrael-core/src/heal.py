"""
AZRAEL Heal — Self-Healing and Recovery Layer

Monitors system state and orchestrates recovery operations
when systems deviate from known-good baselines.
"""
from __future__ import annotations
import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
import uuid

logger = logging.getLogger("azrael.heal")


@dataclass
class SystemSnapshot:
    """A known-good state snapshot for a system component."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    component: str = ""
    state: dict[str, Any] = field(default_factory=dict)
    checksum: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)
    tags: list[str] = field(default_factory=list)


@dataclass  
class RecoveryAction:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    component: str = ""
    action_type: str = ""
    target_snapshot_id: str = ""
    executed_at: datetime | None = None
    success: bool = False
    rollback_available: bool = False


class RecoveryExecutor(ABC):
    """Abstract executor for recovery operations."""
    
    @abstractmethod
    async def restore(self, component: str, snapshot: SystemSnapshot) -> bool: ...
    
    @abstractmethod
    async def validate(self, component: str, snapshot: SystemSnapshot) -> bool: ...


class HealLayer:
    """
    Self-healing orchestrator.
    
    Maintains system baselines and triggers recovery when
    deviation is detected. All recoveries are logged and auditable.
    """
    
    def __init__(self, executor: RecoveryExecutor):
        self._executor = executor
        self._snapshots: dict[str, SystemSnapshot] = {}
        self._recovery_log: list[RecoveryAction] = []
    
    def register_baseline(self, snapshot: SystemSnapshot) -> None:
        """Register a known-good state baseline."""
        self._snapshots[snapshot.component] = snapshot
        logger.info(f"Baseline registered for: {snapshot.component}")
    
    async def heal(self, component: str) -> RecoveryAction:
        """Trigger recovery for a component."""
        snapshot = self._snapshots.get(component)
        if not snapshot:
            raise ValueError(f"No baseline snapshot found for component: {component}")
        
        action = RecoveryAction(
            component=component,
            action_type="restore",
            target_snapshot_id=snapshot.id,
        )
        
        logger.info(f"Starting recovery for {component} → snapshot {snapshot.id}")
        success = await self._executor.restore(component, snapshot)
        
        if success:
            valid = await self._executor.validate(component, snapshot)
            action.success = valid
            if valid:
                logger.info(f"Recovery successful for {component}")
            else:
                logger.error(f"Recovery executed but validation failed for {component}")
        else:
            logger.error(f"Recovery failed for {component}")
        
        action.executed_at = datetime.utcnow()
        self._recovery_log.append(action)
        return action
    
    def get_recovery_log(self) -> list[RecoveryAction]:
        return list(self._recovery_log)
