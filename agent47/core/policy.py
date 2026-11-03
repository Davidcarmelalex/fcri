"""AGENT47 deny-by-default, tenant-scoped skill authorization."""
from dataclasses import dataclass
from typing import FrozenSet

@dataclass(frozen=True)
class Principal:
    telegram_user_id: int
    tenant_id: str
    role: str
    skill_grants: FrozenSet[str]
    active: bool = True

@dataclass(frozen=True)
class Decision:
    allowed: bool
    reason: str

def authorize(principal: Principal | None, skill: dict, tenant_id: str) -> Decision:
    if principal is None or not principal.active:
        return Decision(False, "unknown_or_inactive_identity")
    if not tenant_id or principal.tenant_id != tenant_id:
        return Decision(False, "tenant_mismatch")
    if not skill or skill.get("status") != "implemented":
        return Decision(False, "skill_not_implemented")
    if skill.get("default_access") != "deny":
        return Decision(False, "invalid_skill_policy")
    if skill.get("id") not in principal.skill_grants:
        return Decision(False, "skill_not_granted")
    if skill.get("external_side_effects_allowed", False):
        return Decision(False, "side_effects_disabled")
    return Decision(True, "authorized")
