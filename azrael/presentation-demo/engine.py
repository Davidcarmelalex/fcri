"""Isolated synthetic demonstration of AZRAEL's actual policy boundary.

No shell commands, target sockets, files, or real defensive adapters are used.
State is intentionally per-browser, in memory, and disposable.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from uuid import uuid4

from azrael_core.orchestrator import (
    AuthorizationMode, AzraelOrchestrator, DefenseResponse, PolicyEngine,
    ResponseAction,
)
from azrael_core.sense import EventNormalizer, RawEvent


SCENARIOS = {
    "credential-stuffing": {
        "name": "Credential stuffing", "severity": "high",
        "description": "Repeated synthetic login failures against a demo gateway.",
        "target": "demo://gateway-01", "action": ResponseAction.BLOCK,
        "source": "Synthetic authentication sensor",
        "explanation": "AUTH-101: 120 synthetic failed sign-ins in 60 seconds. Deterministic severity rule: high. Proposed action: block the simulated source.",
        "telemetry": {"type": "credential_stuffing", "severity": "high", "failed_logins": 120, "window_seconds": 60},
    },
    "ransomware": {
        "name": "Ransomware behavior", "severity": "critical",
        "description": "A synthetic burst of file changes on a disposable demo endpoint.",
        "target": "demo://workstation-07", "action": ResponseAction.QUARANTINE,
        "source": "Synthetic endpoint sensor",
        "explanation": "FILE-201: 800 synthetic file rewrites plus a simulated ransom-note marker. Deterministic severity rule: critical. Critical override is disabled, so quarantine still requires approval.",
        "telemetry": {"type": "ransomware_behavior", "severity": "critical", "file_rewrites": 800, "ransom_note_marker": True},
    },
    "suspicious-login": {
        "name": "Unusual login", "severity": "low",
        "description": "A synthetic sign-in from an unfamiliar location, below the containment threshold.",
        "target": "demo://account-42", "action": ResponseAction.ALERT,
        "source": "Synthetic identity sensor",
        "explanation": "AUTH-102: one unfamiliar synthetic sign-in without confirmed compromise. Deterministic severity rule: low. Alerting is automatic; no disruptive action is proposed.",
        "telemetry": {"type": "unusual_login", "severity": "low", "unfamiliar_location": True},
    },
}


class DemoError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def json_value(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, dict):
        return {key: json_value(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_value(item) for item in value]
    return value


class SimulationExecutor:
    """Only records simulated execution in this session's memory."""
    def __init__(self):
        self.calls = []

    async def execute(self, proposal):
        if not proposal.target.startswith("demo://"):
            raise ValueError("Only demo targets are permitted")
        self.calls.append(proposal.proposal_id)
        return DefenseResponse(
            proposal.event_id, proposal.action, proposal.target,
            "Simulated response verified; no real target was contacted.",
            proposal.policy_version, success=True,
        )


class DemoSession:
    MAX_INCIDENTS = 20

    def __init__(self, session_id: str | None = None):
        self.session_id = session_id or str(uuid4())
        self.lock = RLock()
        self.reset()

    def reset(self):
        with self.lock:
            self.core = AzraelOrchestrator(PolicyEngine(critical_override=False, version="demo-policy-1"))
            self.executor = SimulationExecutor()
            self.incidents = {}
            self.proposals = {}
            self.approvals = {}
            self.rejected = set()
            self.blocked_attempts = 0
            self.core.audit.append("demo_session_started", mode="simulation", critical_override=False)
            return self.snapshot()

    def snapshot(self):
        with self.lock:
            # Requests that repeatedly exercise denial/replay must not grow
            # the underlying public-demo audit sink without a bound.
            if len(self.core.audit.records) > 200:
                del self.core.audit.records[:-200]
            incidents = list(self.incidents.values())
            return {
                "sessionId": self.session_id,
                "mode": "simulation",
                "scenarios": [{"id": key, **{field: item[field] for field in ("name", "description", "severity")}} for key, item in SCENARIOS.items()],
                "incidents": [dict(item) for item in reversed(incidents)],
                "audit": json_value(self.core.audit.records[-200:]),
                "stats": {
                    "detected": len(incidents),
                    "pending": sum(item["status"] in ("pending", "approved") for item in incidents),
                    "contained": sum(item["status"] == "contained" for item in incidents),
                    "blocked": self.blocked_attempts,
                },
                "limitations": ["Synthetic telemetry only", "Mock responses only; no real systems are changed", "Session state is in memory and resets on restart", "Presenter approval demonstrates policy, not production identity authentication"],
            }

    def create_incident(self, scenario_id):
        with self.lock:
            if scenario_id not in SCENARIOS:
                raise DemoError("Choose a supplied synthetic scenario")
            if len(self.incidents) >= self.MAX_INCIDENTS:
                raise DemoError("This session reached 20 incidents. Reset the demo to continue.", 409)
            scenario = SCENARIOS[scenario_id]
            now = datetime.now(timezone.utc)
            event = EventNormalizer().normalize(RawEvent(scenario["source"], dict(scenario["telemetry"]), now.timestamp()))
            if event is None:
                raise DemoError("Synthetic event normalization failed", 500)
            self.core.audit.append("telemetry_received", event_id=event.id, source=event.source, synthetic=True)
            self.core.audit.append("incident_detected", event_id=event.id, rule=scenario["explanation"].split(":")[0], severity=event.severity.value)
            response = DefenseResponse(event.id, scenario["action"], scenario["target"], scenario["explanation"], "demo-policy-1")
            proposal = self.core.propose(event, response, incident_id=event.id)
            self.proposals[event.id] = proposal
            self.incidents[event.id] = {
                "id": event.id, "title": scenario["name"], "severity": event.severity.value,
                "source": event.source, "target": proposal.target, "proposalId": proposal.proposal_id,
                "status": "pending", "explanation": scenario["explanation"], "action": proposal.action.value,
                "createdAt": now.isoformat(), "approvalRequired": proposal.mode is AuthorizationMode.APPROVAL_REQUIRED,
            }
            return self.snapshot()

    def _incident(self, incident_id):
        if incident_id not in self.incidents:
            raise DemoError("Incident not found in this browser session", 404)
        return self.incidents[incident_id], self.proposals[incident_id]

    def approve(self, incident_id):
        with self.lock:
            incident, proposal = self._incident(incident_id)
            if incident["status"] != "pending":
                raise DemoError("Only a pending incident can be approved", 409)
            try:
                approval = self.core.approve(proposal, operator_id="demo-presenter", role="responder")
            except (PermissionError, ValueError) as exc:
                raise DemoError(str(exc), 403) from exc
            self.approvals[incident_id] = approval
            incident["status"] = "approved"
            return self.snapshot()

    def execute(self, incident_id):
        with self.lock:
            incident, proposal = self._incident(incident_id)
            if incident_id in self.rejected:
                self.blocked_attempts += 1
                self.core.audit.append("execution_denied", proposal_id=proposal.proposal_id, reason="presenter_rejected")
                raise DemoError("Presenter rejected this proposal. It cannot execute.", 403)
            try:
                # Even pending and already executed incidents reach the real core
                # permission boundary so the demo demonstrates rejection and replay.
                result = asyncio.run(self.core.execute(proposal, self.executor, approval=self.approvals.get(incident_id)))
            except (PermissionError, ValueError, RuntimeError, TimeoutError) as exc:
                self.blocked_attempts += 1
                raise DemoError(str(exc), 403) from exc
            if not result.success:
                raise DemoError("Simulated executor reported failure", 500)
            incident["status"] = "contained"
            self.core.audit.append("simulation_verified", incident_id=incident_id, action=proposal.action.value, target=proposal.target, real_targets_contacted=0)
            return self.snapshot()

    def reject(self, incident_id):
        with self.lock:
            incident, proposal = self._incident(incident_id)
            if incident["status"] in ("contained", "rejected"):
                raise DemoError("This incident is already resolved", 409)
            approval = self.approvals.get(incident_id)
            if approval:
                self.core.revoke_approval(approval.approval_id)
            self.rejected.add(incident_id)
            incident["status"] = "rejected"
            self.core.audit.append("proposal_rejected", proposal_id=proposal.proposal_id, operator_id="demo-presenter")
            return self.snapshot()
