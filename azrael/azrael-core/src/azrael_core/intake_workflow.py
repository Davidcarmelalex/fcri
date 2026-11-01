"""Safe, deterministic citizen-intake workflow.

This is a sandbox engine: it cannot identify callers, register FIRs,
contact providers, or initiate coercive law-enforcement operations.
"""
from __future__ import annotations
import hashlib
import re
from dataclasses import dataclass
from typing import Literal
from .citizen_cases import CitizenCaseStore

Risk = Literal["P0", "P1", "P2", "P3"]


@dataclass(frozen=True)
class IntakeAssessment:
    priority: Risk
    reasons: tuple[str, ...]
    urgent_guidance: tuple[str, ...]
    needs_human: bool


def assess_incident(*, active_loss: bool = False, immediate_danger: bool = False,
                    child_at_risk: bool = False, active_extortion: bool = False,
                    active_account_takeover: bool = False) -> IntakeAssessment:
    """Transparent risk rules: amount lost is never used as a sole signal."""
    if immediate_danger or child_at_risk or active_loss:
        reasons = tuple(k for flag, k in (
            (immediate_danger, "immediate_danger"),
            (child_at_risk, "child_at_risk"),
            (active_loss, "ongoing_financial_loss")) if flag)
        advice = ("Contact local emergency services immediately if anyone is in danger.",
                  "For ongoing financial cyber fraud in India, contact 1930 and your bank immediately."
                  if active_loss else "Seek immediate human assistance.")
        return IntakeAssessment("P0", reasons, advice, True)
    if active_extortion or active_account_takeover:
        reasons = tuple(k for flag, k in (
            (active_extortion, "active_extortion"),
            (active_account_takeover, "account_takeover")) if flag)
        return IntakeAssessment("P1", reasons, ("Request urgent specialist review.",), True)
    return IntakeAssessment("P2", ("standard_complaint",), (), False)


class IntakeWorkflow:
    """Provider-independent ingestion boundary for telephony/WhatsApp adapters."""

    def __init__(self, store: CitizenCaseStore):
        self.store = store

    def register(self, *, channel: str, narrative: str, language: str = "ml",
                 caller_hint: str | None = None, safe_to_contact: bool = False,
                 active_loss: bool = False, immediate_danger: bool = False,
                 child_at_risk: bool = False, active_extortion: bool = False,
                 active_account_takeover: bool = False) -> dict:
        if not isinstance(narrative, str) or not narrative.strip():
            raise ValueError("non-empty narrative required")
        if len(narrative) > 20000:
            raise ValueError("narrative too long")
        if not re.fullmatch(r"[a-z]{2,3}(?:-[A-Za-z]{2,4})?", language):
            raise ValueError("invalid language tag")
        assessment = assess_incident(
            active_loss=active_loss, immediate_danger=immediate_danger,
            child_at_risk=child_at_risk, active_extortion=active_extortion,
            active_account_takeover=active_account_takeover)
        contact_id = self.store.contact(
            channel, caller_hint=caller_hint, safe_to_contact=safe_to_contact)
        case_id = self.store.open_case(
            contact_id, narrative, language=language, priority=assessment.priority)
        self.store.update(case_id, "Risk assessment: " + ",".join(assessment.reasons),
                          actor="deterministic_triage", verified=False)
        return {"case_id": case_id, "contact_id": contact_id,
                "priority": assessment.priority, "reasons": list(assessment.reasons),
                "urgent_guidance": list(assessment.urgent_guidance),
                "requires_human_review": assessment.needs_human,
                "official_fir_registered": False}


def draft_handover(store: CitizenCaseStore, case_id: str, *,
                   authorized_officer: bool = False) -> dict:
    """Explicit authorization; no contact details revealed in this draft."""
    if not authorized_officer:
        raise PermissionError("authorized officer review required")
    row = store.db.execute(
        "SELECT id,priority,status,narrative,language,owner,created_at "
        "FROM cases WHERE id=?", (case_id,)).fetchone()
    if row is None:
        raise LookupError("case not found")
    events = store.history(case_id)
    return {"case": dict(row), "event_count": len(events),
            "events": events, "official_fir_registered": False,
            "caveat": "Citizen allegations and unverified AI assessments are not investigative findings."}
