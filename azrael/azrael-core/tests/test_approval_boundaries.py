from dataclasses import replace
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
import azrael_core.orchestrator as module
from azrael_core import (AzraelOrchestrator, PolicyEngine, ResponseAction,
                         ThreatEvent, ThreatLevel, DefenseResponse, AuthorizationMode, ResponsePlan)


def setup(action=ResponseAction.BLOCK):
    core = AzraelOrchestrator(PolicyEngine(critical_override=False))
    event = ThreatEvent(severity=ThreatLevel.HIGH)
    proposal = core.propose(event, DefenseResponse(event.id, action, "host-1", "test", ""))
    executor = SimpleNamespace(execute=AsyncMock(return_value=DefenseResponse(
        event.id, action, "host-1", "ok", "1", success=True)))
    return core, proposal, executor


@pytest.mark.asyncio
@pytest.mark.parametrize("change", [{"mode": AuthorizationMode.AUTOMATIC}, {"target": "host-2"}])
async def test_forged_proposals_cannot_reach_executor(change):
    core, proposal, executor = setup()
    with pytest.raises(PermissionError, match="modified"):
        await core.execute(replace(proposal, **change), executor)
    executor.execute.assert_not_awaited()


@pytest.mark.asyncio
async def test_forged_approval_is_not_an_issued_approval():
    core, proposal, executor = setup()
    approval = core.approve(proposal, operator_id="alice", role="admin")
    with pytest.raises(PermissionError, match="issued"):
        await core.execute(proposal, executor, approval=replace(approval, operator_id="mallory"))
    executor.execute.assert_not_awaited()


@pytest.mark.asyncio
async def test_revocation_and_role_changes_are_rechecked():
    core, proposal, executor = setup()
    approval = core.approve(proposal, operator_id="alice", role="admin")
    core.allowed_approval_roles.clear()
    with pytest.raises(PermissionError, match="role"):
        await core.execute(proposal, executor, approval=approval)
    core.allowed_approval_roles.add("admin")
    core.revoke_approval(approval.approval_id)
    with pytest.raises(PermissionError, match="revoked"):
        await core.execute(proposal, executor, approval=approval)
    executor.execute.assert_not_awaited()


@pytest.mark.asyncio
async def test_expired_automatic_proposal_cannot_execute(monkeypatch):
    core, proposal, executor = setup(ResponseAction.ALERT)
    future = datetime.now(timezone.utc) + timedelta(hours=1)
    class Clock(datetime):
        @classmethod
        def now(cls, tz=None):
            return future
    monkeypatch.setattr(module, "datetime", Clock)
    with pytest.raises(PermissionError, match="expired"):
        await core.execute(proposal, executor)
    executor.execute.assert_not_awaited()


@pytest.mark.asyncio
async def test_policy_revision_invalidates_old_proposal():
    core, proposal, executor = setup()
    approval = core.approve(proposal, operator_id="alice", role="admin")
    core._policy.version = "2"
    with pytest.raises(PermissionError, match="Policy changed"):
        await core.execute(proposal, executor, approval=approval)
    executor.execute.assert_not_awaited()


@pytest.mark.asyncio
async def test_dry_run_does_not_consume_approval_or_execution_claim():
    core, proposal, executor = setup()
    approval = core.approve(proposal, operator_id="alice", role="admin")
    await core.execute(proposal, executor, approval=approval, dry_run=True)
    executor.execute.assert_not_awaited()
    assert (await core.execute(proposal, executor, approval=approval)).success
    executor.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_pending_agent_response_requires_explicit_approval():
    core, _, _ = setup()
    event = ThreatEvent(severity=ThreatLevel.HIGH)
    agent = SimpleNamespace(agent_id="agent", capabilities=["block"],
                            plan=AsyncMock(return_value=ResponsePlan(event.id, ResponseAction.BLOCK,
                                                                    "host-1", "test", "1")),
                            execute=AsyncMock(return_value=True))
    core.register_agent(agent)
    assert await core._process(event) == []
    agent.execute.assert_not_awaited()
    pending = [p for p in core.get_pending_proposals() if p.event_id == event.id]
    assert len(pending) == 1
    assert core.get_audit_log()[-1].status == "approval_required"


@pytest.mark.asyncio
async def test_kill_switch_also_blocks_normal_agent_pipeline():
    core, _, _ = setup()
    event = ThreatEvent()
    agent = SimpleNamespace(agent_id="agent", capabilities=["alert"],
                            plan=AsyncMock(return_value=ResponsePlan(event.id, ResponseAction.ALERT,
                                                                    "host-1", "test", "1")),
                            execute=AsyncMock(return_value=True))
    core.register_agent(agent)
    core.set_kill_switch(True)
    assert await core._process(event) == []
    agent.execute.assert_not_awaited()
    assert core.audit.records[-1]["event"] == "execution_denied"


@pytest.mark.asyncio
async def test_mismatched_executor_result_is_audited():
    core, proposal, executor = setup(ResponseAction.ALERT)
    executor.execute.return_value.target = "unauthorized-target"
    with pytest.raises(ValueError, match="does not match"):
        await core.execute(proposal, executor)
    assert core.audit.records[-1]["event"] == "execution_failed"
    with pytest.raises(PermissionError, match="claimed"):
        await core.execute(proposal, executor)


@pytest.mark.asyncio
async def test_concurrent_approval_use_executes_once():
    import asyncio
    core, proposal, executor = setup()
    approval = core.approve(proposal, operator_id="alice", role="admin")
    results = await asyncio.gather(core.execute(proposal, executor, approval=approval),
                                   core.execute(proposal, executor, approval=approval), return_exceptions=True)
    assert sum(isinstance(r, DefenseResponse) for r in results) == 1
    executor.execute.assert_awaited_once()


def test_empty_role_and_policy_configuration_does_not_fall_back_to_defaults():
    core = AzraelOrchestrator(PolicyEngine({}, critical_override=False), allowed_approval_roles=set())
    assert core.allowed_approval_roles == set()
    assert core._policy.mode(ResponseAction.ALERT, ThreatLevel.LOW) is AuthorizationMode.DENIED
