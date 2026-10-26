"""
AZRAEL Core Test Suite
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timezone, timedelta
from azrael_core.orchestrator import (
    AzraelOrchestrator, PolicyEngine, ThreatEvent,
    ThreatLevel, ResponseAction, DefenseResponse
)


class TestPolicyEngine:
    def test_auto_actions_always_authorized(self):
        policy = PolicyEngine()
        assert policy.authorize(ResponseAction.ALERT, ThreatLevel.LOW)
        assert policy.authorize(ResponseAction.REPORT, ThreatLevel.LOW)
    
    def test_critical_authorizes_all(self):
        policy = PolicyEngine()
        for action in ResponseAction:
            assert policy.authorize(action, ThreatLevel.CRITICAL)
    
    def test_quarantine_blocked_for_low_threat(self):
        policy = PolicyEngine()
        assert not policy.authorize(ResponseAction.QUARANTINE, ThreatLevel.LOW)
    
    def test_isolate_allowed_for_high_threat(self):
        policy = PolicyEngine()
        assert policy.authorize(ResponseAction.ISOLATE, ThreatLevel.HIGH)


class TestAzraelOrchestrator:
    @pytest.mark.asyncio
    async def test_event_ingestion(self):
        orchestrator = AzraelOrchestrator()
        event = ThreatEvent(event_type="test", severity=ThreatLevel.LOW)
        await orchestrator.ingest(event)
        assert orchestrator._event_queue.qsize() == 1
    
    @pytest.mark.asyncio
    async def test_agent_registration(self):
        orchestrator = AzraelOrchestrator()
        mock_agent = MagicMock()
        mock_agent.agent_id = "test-agent"
        mock_agent.capabilities = ["alert"]
        orchestrator.register_agent(mock_agent)
        assert len(orchestrator._agents) == 1
    
    @pytest.mark.asyncio
    async def test_policy_blocks_unauthorized_response(self):
        policy = PolicyEngine()
        orchestrator = AzraelOrchestrator(policy_engine=policy)
        
        mock_agent = MagicMock()
        mock_agent.agent_id = "test-agent"
        mock_agent.capabilities = ["quarantine"]
        mock_agent.handle = AsyncMock(return_value=DefenseResponse(
            event_id="e1",
            action=ResponseAction.QUARANTINE,
            target="host-1",
            rationale="test",
            policy_ref="test-policy",
        ))
        orchestrator.register_agent(mock_agent)
        
        low_event = ThreatEvent(event_type="test", severity=ThreatLevel.LOW)
        responses = await orchestrator._process(low_event)
        assert len(responses) == 0  # Quarantine blocked for LOW
        
        critical_event = ThreatEvent(event_type="test", severity=ThreatLevel.CRITICAL)
        responses = await orchestrator._process(critical_event)
        assert len(responses) == 1  # Authorized for CRITICAL

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
        with pytest.raises(RuntimeError):
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
