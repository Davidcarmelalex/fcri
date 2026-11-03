"""AZ-002 design-only contract tests.

These tests use a local mock gate rather than the production orchestrator. They
specify the intended authorization boundary without changing live behavior.
"""

from dataclasses import dataclass
from unittest.mock import Mock

import pytest

from azrael_core.orchestrator import ResponseAction, ThreatLevel


APPROVED = {
    ThreatLevel.LOW: {ResponseAction.ALERT, ResponseAction.REPORT},
    ThreatLevel.MEDIUM: {ResponseAction.ALERT, ResponseAction.REPORT},
    ThreatLevel.HIGH: {
        ResponseAction.ALERT,
        ResponseAction.REPORT,
        ResponseAction.ISOLATE,
        ResponseAction.BLOCK,
    },
    ThreatLevel.CRITICAL: set(ResponseAction),
}


@dataclass
class MockGate:
    policy: Mock
    executor: Mock

    def submit(self, action: ResponseAction, level: ThreatLevel) -> bool:
        approved = self.policy.authorize(action, level)
        if not approved:
            return False
        self.executor.execute(action)
        return True


@pytest.fixture
def gate():
    policy = Mock()
    policy.authorize.side_effect = lambda action, level: action in APPROVED[level]
    return MockGate(policy=policy, executor=Mock())


@pytest.mark.parametrize("level, actions", APPROVED.items())
def test_az002_approval_matrix_is_explicit(gate, level, actions):
    for action in ResponseAction:
        expected = action in actions
        assert gate.submit(action, level) is expected


@pytest.mark.parametrize(
    "level, action",
    [
        (ThreatLevel.LOW, ResponseAction.ISOLATE),
        (ThreatLevel.MEDIUM, ResponseAction.BLOCK),
        (ThreatLevel.HIGH, ResponseAction.QUARANTINE),
        (ThreatLevel.HIGH, ResponseAction.RESTORE),
    ],
)
def test_denial_has_no_executor_side_effect(gate, level, action):
    assert gate.submit(action, level) is False
    gate.executor.execute.assert_not_called()


def test_approved_action_executes_once_after_policy_decision(gate):
    assert gate.submit(ResponseAction.ISOLATE, ThreatLevel.HIGH) is True
    gate.policy.authorize.assert_called_once_with(
        ResponseAction.ISOLATE, ThreatLevel.HIGH
    )
    gate.executor.execute.assert_called_once_with(ResponseAction.ISOLATE)
