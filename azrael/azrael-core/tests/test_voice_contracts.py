import pytest
from azrael_core.voice_contracts import SpeechResult, VoiceSession, SessionState, SyntheticSpeechProvider

def test_synthetic_speech_provider_is_explicitly_not_real_audio():
    p = SyntheticSpeechProvider()
    r = p.transcribe("എന്റെ പണം പോയി".encode(), "text/plain", "ml")
    assert r.provider == "SYNTHETIC_TEST_PROVIDER"
    assert p.synthesize("Help is available", "en").mime_type == "text/plain"

def test_session_handles_language_switch_and_final_transcripts():
    s = VoiceSession()
    s.start()
    s.ingest(SpeechResult("സഹായിക്കൂ", "ml", .99, "mock"))
    s.ingest(SpeechResult("I need help", "en", .95, "mock"))
    s.ingest(SpeechResult("partial", "en", .99, "mock", final=False))
    assert len(s.transcript) == 2 and s.language == "en"

def test_low_confidence_escalates_to_human():
    s = VoiceSession()
    s.start()
    s.ingest(SpeechResult("uncertain", "ml", .2, "mock"))
    assert s.state is SessionState.HANDOFF
    assert not s.transcript
    with pytest.raises(RuntimeError):
        s.ingest(SpeechResult("late", "ml", .9, "mock"))

def test_session_closed_does_not_reopen():
    s = VoiceSession()
    s.start()
    s.close()
    with pytest.raises(RuntimeError):
        s.start()
    with pytest.raises(RuntimeError):
        s.escalate("request")

def test_invalid_confidence_is_rejected():
    with pytest.raises(ValueError):
        SpeechResult("sample", "ml", 1.5, "mock")
