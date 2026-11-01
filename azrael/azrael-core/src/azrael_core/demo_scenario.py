"""Deterministic end-to-end Phase 1 synthetic demonstration.

No telecommunications, official police databases, or outbound delivery is used.
"""
from __future__ import annotations

import json
import tempfile
from pathlib import Path

from .citizen_cases import CitizenCaseStore
from .continuity import ContinuityEngine
from .intake_workflow import IntakeWorkflow, draft_handover


def run_synthetic_demo(database_path: str | Path) -> dict:
    store = CitizenCaseStore(database_path)
    try:
        conversation = ContinuityEngine(store)
        intake = IntakeWorkflow(store)
        case = intake.register(
            channel="phone",
            narrative="Fictional Malayalam-speaking citizen reports ongoing UPI fraud.",
            language="ml",
            caller_hint=None,
            safe_to_contact=True,  # explicit consent in fictional simulation
            active_loss=True,
        )
        case_id = case["case_id"]
        conversation.add_turn(case_id, "citizen",
                              "എന്റെ അക്കൗണ്ടിൽ നിന്ന് പണം പോയി. എനിക്ക് പേടിയാകുന്നു.")
        conversation.add_turn(case_id, "agent",
                              "നിങ്ങൾക്ക് സംഭവിച്ചതിൽ വിഷമമുണ്ട്. ആദ്യം ബാങ്കിനെയും 1930-നെയും ബന്ധപ്പെടാം.")
        # Returning caller can see their history only after authentication
        resume_denied = False
        try:
            conversation.resume(case_id)
        except PermissionError:
            resume_denied = True
        conversation.add_turn(case_id, "citizen",
                              "My bank has acknowledged the report.", language="en")
        conversation.add_turn(case_id, "agent",
                              "We have retained your earlier details; you need not repeat them.",
                              language="en")
        store.assign(case_id, "DEMO-OFFICER-01")
        store.update(case_id, "Assigned for authorized review",
                     actor="DEMO-OFFICER-01", verified=True)
        notification_id = conversation.schedule_update(
            case_id, "Your complaint was assigned for review (simulation).",
            "demo-assignment-" + case_id,
            verified_case_event=True,
        )
        queued = conversation.claim_due()
        assert queued is not None and queued["id"] == notification_id
        # This is ONLY a mock provider acknowledgement.
        conversation.complete(notification_id, delivered=True)
        handover = draft_handover(store, case_id, authorized_officer=True)
        case_history = conversation.resume(case_id, identity_verified=True)
        status = store.db.execute(
            "SELECT status FROM notifications WHERE id=?", (notification_id,)
        ).fetchone()["status"]
        return {
            "mode": "SYNTHETIC_OFFLINE_DEMO",
            "case_id": case_id,
            "priority": case["priority"],
            "official_fir_registered": False,
            "callback_consent": True,
            "anonymous_intake": True,
            "unauthenticated_resume_blocked": resume_denied,
            "conversation_turns": len(case_history),
            "languages": sorted({row["language"] for row in case_history}),
            "officer_handover_events": handover["event_count"],
            "notification_delivery": "MOCK_ACKNOWLEDGEMENT_" + status.upper(),
            "real_provider_used": False,
        }
    finally:
        store.close()


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="azrael-sandbox-") as folder:
        print(json.dumps(run_synthetic_demo(Path(folder) / "demo.sqlite"),
                         ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
