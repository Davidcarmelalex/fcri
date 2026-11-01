import pytest
from azrael_core.citizen_cases import CitizenCaseStore
from azrael_core.intake_workflow import IntakeWorkflow, assess_incident, draft_handover

@pytest.fixture
def workflow(tmp_path):
    store = CitizenCaseStore(tmp_path / "intake.sqlite")
    yield IntakeWorkflow(store)
    store.close()

def test_ongoing_fraud_urgent_and_not_official_registration(workflow):
    r = workflow.register(channel="phone", narrative="Transfer in progress",
                          active_loss=True, language="ml")
    assert r["priority"] == "P0"
    assert r["requires_human_review"]
    assert any("1930" in x for x in r["urgent_guidance"])
    assert not r["official_fir_registered"]

def test_distress_risk_uses_rules_not_rupee_amount():
    assert assess_incident(active_extortion=True).priority == "P1"
    assert assess_incident(child_at_risk=True).priority == "P0"
    assert assess_incident().priority == "P2"

def test_unknown_caller_no_outbound_without_safety_consent(workflow):
    r = workflow.register(channel="phone", narrative="Threatened", caller_hint="+911234567890")
    assert not workflow.store.eligible_outbound(r["case_id"])

def test_handover_requires_authorization(workflow):
    r = workflow.register(channel="whatsapp", narrative="Account compromised", language="hi")
    with pytest.raises(PermissionError):
        draft_handover(workflow.store, r["case_id"])
    d = draft_handover(workflow.store, r["case_id"], authorized_officer=True)
    assert d["case"]["language"] == "hi" and d["event_count"] == 2

def test_empty_or_malformed_input_rejected(workflow):
    with pytest.raises(ValueError):
        workflow.register(channel="phone", narrative=" ")
    with pytest.raises(ValueError):
        workflow.register(channel="phone", narrative="report", language="invalid-long")
