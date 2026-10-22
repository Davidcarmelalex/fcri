"""Read-only skill execution with policy checks and explicit adapters."""
from dataclasses import dataclass
from typing import Callable, Mapping
from .policy import Principal, authorize

@dataclass(frozen=True)
class ExecutionResult:
    ok: bool
    status: str
    output: str

class SkillExecutor:
    def __init__(self, registry: Mapping[str, dict], adapters: Mapping[str, Callable]):
        self.registry = registry
        self.adapters = adapters

    def execute(self, principal: Principal | None, tenant_id: str, skill_id: str, payload: dict | None = None) -> ExecutionResult:
        skill = self.registry.get(skill_id)
        decision = authorize(principal, skill, tenant_id)
        if not decision.allowed:
            return ExecutionResult(False, "denied", decision.reason)
        adapter = self.adapters.get(skill_id)
        if adapter is None:
            return ExecutionResult(False, "unavailable", "no_verified_adapter")
        try:
            # Only read-only adapters may be registered in this prototype.
            output = adapter(dict(payload or {}))
            return ExecutionResult(True, "completed", str(output))
        except Exception:
            return ExecutionResult(False, "failed", "adapter_execution_failed")
