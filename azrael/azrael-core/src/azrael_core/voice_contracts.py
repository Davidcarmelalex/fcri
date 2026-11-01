"""Provider-neutral voice session contracts for AZRAEL CARE.

Safe offline reference. Real Sarvam/ElevenLabs clients require independently
configured credentials, privacy assessment and live contract tests.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Protocol, runtime_checkable
import uuid

class SessionState(str, Enum):
    NEW = "new"
    ACTIVE = "active"
    HANDOFF = "handoff"
    CLOSED = "closed"

@dataclass(frozen=True)
class SpeechResult:
    transcript: str
    language: str
    confidence: float
    provider: str
    final: bool = True

    def __post_init__(self):
        if not 0 <= self.confidence <= 1:
            raise ValueError("confidence must be between zero and one")
        if not self.provider.strip():
            raise ValueError("provider required")

@dataclass(frozen=True)
class SpeechAudio:
    payload: bytes
    mime_type: str
    provider: str

@runtime_checkable
class SpeechRecognizer(Protocol):
    def transcribe(self, payload: bytes, mime_type: str, language_hint: str | None) -> SpeechResult: ...

@runtime_checkable
class SpeechSynthesizer(Protocol):
    def synthesize(self, text: str, language: str) -> SpeechAudio: ...

class SyntheticSpeechProvider:
    """Deterministic, clearly labelled test provider; never real voice synthesis."""
    def transcribe(self, payload: bytes, mime_type: str, language_hint: str | None) -> SpeechResult:
        if mime_type != "text/plain":
            raise ValueError("synthetic provider only accepts UTF-8 text fixtures")
        text = payload.decode("utf-8")
        return SpeechResult(text, language_hint or "ml", 1.0, "SYNTHETIC_TEST_PROVIDER")

    def synthesize(self, text: str, language: str) -> SpeechAudio:
        if not text.strip():
            raise ValueError("text is required")
        return SpeechAudio(text.encode("utf-8"), "text/plain", "SYNTHETIC_TEST_PROVIDER")

@dataclass
class VoiceSession:
    """An authenticated gateway owns the session; a caller-ID alone never does."""
    session_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    language: str = "ml"
    state: SessionState = SessionState.NEW
    transcript: list[SpeechResult] = field(default_factory=list)
    escalation_reason: str | None = None

    def start(self) -> None:
        if self.state is not SessionState.NEW:
            raise RuntimeError("session already started")
        self.state = SessionState.ACTIVE

    def ingest(self, speech: SpeechResult, *, minimum_confidence: float = 0.70) -> None:
        if self.state is not SessionState.ACTIVE:
            raise RuntimeError("session is not active")
        if not speech.final:
            return
        if not speech.transcript.strip() or speech.confidence < minimum_confidence:
            self.escalate("unreliable_speech_recognition")
            return
        self.transcript.append(speech)
        self.language = speech.language

    def escalate(self, reason: str) -> None:
        if self.state is SessionState.CLOSED:
            raise RuntimeError("session is closed")
        if not reason.strip():
            raise ValueError("reason required")
        self.escalation_reason = reason
        self.state = SessionState.HANDOFF

    def close(self) -> None:
        self.state = SessionState.CLOSED
