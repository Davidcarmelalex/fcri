"""Bind trusted, offline speech sessions to AZRAEL case continuity.

Only a server-side authenticated communication adapter may invoke these
operations. No caller-ID-based case access or real telecom connectivity.
"""
from __future__ import annotations
from dataclasses import dataclass
from .voice_contracts import VoiceSession, SpeechResult, SessionState
from .citizen_cases import CitizenCaseStore
from .continuity import ContinuityEngine
from .intake_workflow import IntakeWorkflow, draft_handover

@dataclass
class VoiceCaseBridge:
    store: CitizenCaseStore
    continuity: ContinuityEngine
    intake: IntakeWorkflow
    session: VoiceSession
    case_id: str | None = None

    def begin(self, *, narrative: str, channel: str = "phone",
              safe_to_contact: bool = False, active_loss: bool = False) -> dict:
        if self.case_id is not None or self.session.state is not SessionState.NEW:
            raise RuntimeError("session already bound")
        result = self.intake.register(
            channel=channel, narrative=narrative, language=self.session.language,
            safe_to_contact=safe_to_contact, active_loss=active_loss)
        self.case_id = result["case_id"]
        self.session.start()
        self.continuity.add_turn(self.case_id, "citizen", narrative,
                                 self.session.language, source="voice")
        return result

    def accept_transcript(self, speech: SpeechResult) -> bool:
        if self.case_id is None:
            raise RuntimeError("intake has not begun")
        before = len(self.session.transcript)
        self.session.ingest(speech)
        if len(self.session.transcript) == before:
            return False
        self.continuity.add_turn(
            self.case_id, "citizen", speech.transcript, speech.language, source="voice")
        return True

    def agent_reply(self, message: str) -> None:
        if self.case_id is None or self.session.state is not SessionState.ACTIVE:
            raise RuntimeError("session not active")
        self.continuity.add_turn(self.case_id, "agent", message,
                                 self.session.language, source="voice")

    def handover(self, *, authorized_officer: bool = False) -> dict:
        if self.case_id is None:
            raise RuntimeError("intake has not begun")
        if not authorized_officer:
            raise PermissionError("officer authorization required")
        result = draft_handover(self.store, self.case_id, authorized_officer=True)
        result["conversation"] = self.continuity.resume(
            self.case_id, authorized_officer=True)
        result["escalation_reason"] = self.session.escalation_reason
        return result
