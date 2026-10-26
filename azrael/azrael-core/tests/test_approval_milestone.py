import pytest
from unittest.mock import AsyncMock
from datetime import datetime, timezone, timedelta
from azrael_core.orchestrator import AzraelOrchestrator, PolicyEngine, ThreatEvent, ThreatLevel, ResponseAction, DefenseResponse

class TestApprovalMilestone:
    @pytest.mark.asyncio
    async def test_denied_action_never_invokes_executor(self):
        policy = PolicyEngine(policies={"auto": [], "supervised": [], "manual": []}, critical_override=False)
        orchestrator = AzraelOrchestrator(policy)
        event = ThreatEvent(event_type="test", severity=ThreatLevel.LOW)
        proposal = orchestrator.propose(event, DefenseResponse(event.id, ResponseAction.BLOCK, "host-1", "test", ""))
        executor = AsyncMock()
        with pytest.raises(PermissionError):
            await orchestrator.execute(proposal, executor)
        executor.execute.assert_not_awaited()

    @pytest.mark.asyncio
    async def test_approval_is_bound_and_single_use(self):
        policy = PolicyEngine(policies={"auto": [], "supervised": ["block"], "manual": []}, critical_override=False)
        orchestrator = AzraelOrchestrator(policy)
        event = ThreatEvent(event_type="test", severity=ThreatLevel.HIGH)
        proposal = orchestrator.propose(event, DefenseResponse(event.id, ResponseAction.BLOCK, "host-1", "test", ""))
        approval = orchestrator.approve(proposal, operator_id="alice", role="responder")
        executor = AsyncMock()
        executor.execute.return_value = DefenseResponse(event.id, ResponseAction.BLOCK, "host-1", "ok", "1", success=True)
        assert (await orchestrator.execute(proposal, executor, approval=approval)).success
        with pytest.raises(PermissionError):
            await orchestrator.execute(proposal, executor, approval=approval)
        assert executor.execute.await_count == 1

    @pytest.mark.asyncio
    async def test_mismatched_approval_is_rejected(self):
        policy = PolicyEngine(policies={"auto": [], "supervised": ["block"], "manual": []}, critical_override=False)
        orchestrator = AzraelOrchestrator(policy)
        event = ThreatEvent(event_type="test", severity=ThreatLevel.HIGH)
        first = orchestrator.propose(event, DefenseResponse(event.id, ResponseAction.BLOCK, "host-1", "a", ""))
        second = orchestrator.propose(event, DefenseResponse(event.id, ResponseAction.BLOCK, "host-2", "b", ""))
        approval = orchestrator.approve(first, operator_id="alice", role="responder")
        with pytest.raises(PermissionError):
            await orchestrator.execute(second, AsyncMock(), approval=approval)

    @pytest.mark.asyncio
    async def test_role_and_kill_switch_are_enforced(self):
        policy = PolicyEngine(policies={"auto": [], "supervised": ["block"], "manual": []}, critical_override=False)
        orchestrator = AzraelOrchestrator(policy, allowed_approval_roles={"admin"})
        event = ThreatEvent(event_type="test", severity=ThreatLevel.HIGH)
        proposal = orchestrator.propose(event, DefenseResponse(event.id, ResponseAction.BLOCK, "host-1", "test", ""))
        with pytest.raises(PermissionError):
            orchestrator.approve(proposal, operator_id="alice", role="responder")
        approval = orchestrator.approve(proposal, operator_id="alice", role="admin")
        orchestrator.set_kill_switch(True)
        with pytest.raises(PermissionError):
            await orchestrator.execute(proposal, AsyncMock(), approval=approval)

    @pytest.mark.asyncio
    async def test_dry_run_does_not_invoke_executor(self):
        policy = PolicyEngine(policies={"auto": [], "supervised": ["block"], "manual": []}, critical_override=False)
        orchestrator = AzraelOrchestrator(policy)
        event = ThreatEvent(event_type="test", severity=ThreatLevel.HIGH)
        proposal = orchestrator.propose(event, DefenseResponse(event.id, ResponseAction.BLOCK, "host-1", "test", ""))
        approval = orchestrator.approve(proposal, operator_id="alice", role="responder")
        executor = AsyncMock()
        result = await orchestrator.execute(proposal, executor, approval=approval, dry_run=True)
        assert result.success
        executor.execute.assert_not_awaited()
