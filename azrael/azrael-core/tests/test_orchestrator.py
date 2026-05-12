"""
AZRAEL Core Test Suite
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
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
