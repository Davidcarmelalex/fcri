import pytest
from azrael_core.citizen_cases import CitizenCaseStore
from azrael_core.continuity import ContinuityEngine
from azrael_core.intake_workflow import IntakeWorkflow
from azrael_core.voice_contracts import VoiceSession, SpeechResult, SessionState
from azrael_core.voice_case_bridge import VoiceCaseBridge

@pytest.fixture
def bridge(tmp_path):
    store=CitizenCaseStore(tmp_path/"bridge.sqlite")
    b=VoiceCaseBridge(store,ContinuityEngine(store),IntakeWorkflow(store),VoiceSession())
    yield b
    store.close()

def test_voice_intake_persists_and_handover(bridge):
    data=bridge.begin(narrative="എന്റെ പണം പോയി",active_loss=True)
    assert data["priority"]=="P0"
    bridge.agent_reply("ബാങ്കിനെയും 1930-നെയും ഉടൻ ബന്ധപ്പെടൂ")
    assert bridge.accept_transcript(SpeechResult("I need help","en",.98,"fake"))
    with pytest.raises(PermissionError):
        bridge.handover()
    handover=bridge.handover(authorized_officer=True)
    assert len(handover["conversation"])==3
    assert handover["conversation"][-1]["language"]=="en"

def test_partial_transcript_not_persisted(bridge):
    bridge.begin(narrative="Initial report")
    assert not bridge.accept_transcript(SpeechResult("unfinished","ml",.9,"fake",final=False))
    assert len(bridge.handover(authorized_officer=True)["conversation"])==1

def test_unreliable_speech_escalates_without_inserting_turn(bridge):
    bridge.begin(narrative="Initial report")
    assert not bridge.accept_transcript(SpeechResult("unclear","ml",.22,"fake"))
    assert bridge.session.state==SessionState.HANDOFF
    assert bridge.handover(authorized_officer=True)["escalation_reason"]=="unreliable_speech_recognition"
    with pytest.raises(RuntimeError):
        bridge.agent_reply("continue")

def test_cannot_rebind_same_call(bridge):
    bridge.begin(narrative="Initial report")
    with pytest.raises(RuntimeError):
        bridge.begin(narrative="second")

def test_cannot_ingest_before_begin(bridge):
    with pytest.raises(RuntimeError):
        bridge.accept_transcript(SpeechResult("test","en",1,"fake"))
