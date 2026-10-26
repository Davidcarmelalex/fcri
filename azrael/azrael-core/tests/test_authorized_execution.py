"""Execution boundaries use mock agents only; no external targets."""
import asyncio
from dataclasses import FrozenInstanceError, replace
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from azrael_core import AzraelOrchestrator, ResponseAction, ResponsePlan, ThreatEvent, ThreatLevel


def agent(action=ResponseAction.ALERT, agent_id="test-agent"):
    return SimpleNamespace(
        agent_id=agent_id, capabilities=[action.value],
        plan=AsyncMock(side_effect=lambda event: ResponsePlan(
            event.id, action, "mock-host", "unit test", "test-policy")),
        execute=AsyncMock(return_value=True),
    )


@pytest.mark.asyncio
@pytest.mark.parametrize("severity", [ThreatLevel.LOW, ThreatLevel.MEDIUM])
@pytest.mark.parametrize("action", [ResponseAction.ISOLATE, ResponseAction.BLOCK,
                                  ResponseAction.QUARANTINE, ResponseAction.RESTORE])
async def test_denied_actions_never_execute(action, severity):
    core = AzraelOrchestrator()
    mock = agent(action)
    core.register_agent(mock)
    event = ThreatEvent(severity=severity)
    assert await core._process(event) == []
    mock.execute.assert_not_awaited()
    assert not event.handled
    assert [entry.status for entry in core.get_audit_log()] == ["denied"]


@pytest.mark.asyncio
async def test_authorization_precedes_execution_and_replay_is_skipped():
    core = AzraelOrchestrator()
    mock = agent()

    async def execute(plan):
        assert core.get_audit_log()[-1].status == "authorized"
        with pytest.raises(FrozenInstanceError):
            plan.target = "another-host"
        return True

    mock.execute.side_effect = execute
    core.register_agent(mock)
    event = ThreatEvent()
    result = await core._process(event)
    assert result[0].success and event.handled
    assert await core._process(event) == []
    mock.execute.assert_awaited_once()
    assert [entry.status for entry in core.get_audit_log()] == [
        "authorized", "succeeded", "duplicate"]


@pytest.mark.asyncio
async def test_concurrent_duplicate_executes_once():
    core = AzraelOrchestrator()
    mock = agent()
    original_plan = mock.plan.side_effect

    async def plan(event):
        await asyncio.sleep(0)
        return original_plan(event)

    mock.plan.side_effect = plan
    core.register_agent(mock)
    event = ThreatEvent()
    results = await asyncio.gather(core._process(event), core._process(event))
    assert sum(map(len, results)) == 1
    mock.execute.assert_awaited_once()
    assert event.handled


@pytest.mark.asyncio
async def test_planner_cannot_escalate_event_severity():
    core = AzraelOrchestrator()
    mock = agent(ResponseAction.QUARANTINE)
    original_plan = mock.plan.side_effect

    def plan(event):
        event.severity = ThreatLevel.CRITICAL
        event.payload["changed"] = True
        return original_plan(event)

    mock.plan.side_effect = plan
    core.register_agent(mock)
    event = ThreatEvent()
    assert await core._process(event) == []
    assert event.severity is ThreatLevel.LOW and event.payload == {}
    mock.execute.assert_not_awaited()


@pytest.mark.asyncio
@pytest.mark.parametrize("changes", [{"event_id": "wrong-event"}, {"action": "alert"},
                                     {"target": ""}, {"policy_ref": ""}])
async def test_invalid_proposals_fail_closed(changes):
    core = AzraelOrchestrator()
    mock = agent()
    original_plan = mock.plan.side_effect
    mock.plan.side_effect = lambda event: replace(original_plan(event), **changes)
    core.register_agent(mock)
    assert await core._process(ThreatEvent()) == []
    mock.execute.assert_not_awaited()
    assert core.get_audit_log()[-1].status == "error"


@pytest.mark.asyncio
@pytest.mark.parametrize("stage", ["plan", "execute"])
async def test_errors_are_audited_and_other_agents_continue(stage):
    core = AzraelOrchestrator()
    broken, healthy = agent(agent_id="broken"), agent(agent_id="healthy")
    getattr(broken, stage).side_effect = RuntimeError("mock failure")
    core.register_agent(broken)
    core.register_agent(healthy)
    assert len(await core._process(ThreatEvent())) == 1
    healthy.execute.assert_awaited_once()
    errors = [entry for entry in core.get_audit_log() if entry.status == "error"]
    assert errors[0].agent_id == "broken" and errors[0].error == "mock failure"
    if stage == "plan":
        broken.execute.assert_not_awaited()


@pytest.mark.asyncio
async def test_execution_failure_is_not_handled_or_automatically_retried():
    core = AzraelOrchestrator()
    mock = agent()
    mock.execute.return_value = False
    core.register_agent(mock)
    event = ThreatEvent()
    result = await core._process(event)
    assert not result[0].success and result[0].error
    assert not event.handled
    assert core.get_audit_log()[-1].status == "failed"
    await core._process(event)
    mock.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_cancellation_propagates_and_does_not_retry_uncertain_execution():
    core = AzraelOrchestrator()
    mock = agent()
    mock.execute.side_effect = asyncio.CancelledError
    core.register_agent(mock)
    event = ThreatEvent()
    with pytest.raises(asyncio.CancelledError):
        await core._process(event)
    assert core.get_audit_log()[-1].status == "cancelled"
    await core._process(event)
    mock.execute.assert_awaited_once()


def test_legacy_agents_and_duplicate_ids_rejected():
    core = AzraelOrchestrator()
    with pytest.raises(TypeError, match="plan"):
        core.register_agent(SimpleNamespace(agent_id="legacy", handle=AsyncMock()))
    core.register_agent(agent())
    with pytest.raises(ValueError, match="Duplicate"):
        core.register_agent(agent())


def test_audit_log_returns_a_copy():
    core = AzraelOrchestrator()
    snapshot = core.get_audit_log()
    snapshot.append("external change")
    assert core.get_audit_log() == []
