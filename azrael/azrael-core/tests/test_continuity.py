from datetime import datetime, timedelta, timezone
import pytest
from azrael_core.citizen_cases import CitizenCaseStore
from azrael_core.continuity import ContinuityEngine

@pytest.fixture
def setup(tmp_path):
    store = CitizenCaseStore(tmp_path / "continuity.sqlite")
    engine = ContinuityEngine(store)
    yield store, engine
    store.close()

def make_case(store, consent=True):
    contact = store.contact("phone", safe_to_contact=consent)
    return store.open_case(contact, "Reported unauthorized transfer")

def test_conversation_recovers_only_after_verification(setup):
    store, engine = setup
    case = make_case(store)
    engine.add_turn(case, "citizen", "I lost money", source="voice")
    engine.add_turn(case, "agent", "I can help organize your complaint")
    with pytest.raises(PermissionError):
        engine.resume(case)
    dialogue = engine.resume(case, identity_verified=True)
    assert len(dialogue) == 2 and dialogue[0]["role"] == "citizen"

def test_queue_requires_verified_event_and_contact_consent(setup):
    store, engine = setup
    case = make_case(store, consent=False)
    with pytest.raises(PermissionError):
        engine.schedule_update(case, "Status", "e1", verified_case_event=True)
    case2 = make_case(store)
    with pytest.raises(PermissionError):
        engine.schedule_update(case2, "Status", "e2")
    assert engine.claim_due() is None

def test_delivery_lease_and_idempotency(setup):
    store, engine = setup
    case = make_case(store)
    mid = engine.schedule_update(case, "Assigned to reviewer", "case-event-1",
                                 verified_case_event=True)
    assert mid == engine.schedule_update(case, "Assigned to reviewer", "case-event-1",
                                        verified_case_event=True)
    claimed = engine.claim_due()
    assert claimed["id"] == mid and claimed["attempts"] == 1
    assert engine.claim_due() is None
    engine.complete(mid, delivered=True)
    assert engine.claim_due() is None

def test_closure_suppresses_queued_messages(setup):
    store, engine = setup
    case = make_case(store)
    store.assign(case, "officer-a")
    engine.schedule_update(case, "Case progress", "event-a", verified_case_event=True)
    store.disposition(case, "CLOSED_BY_AUTHORITY", "officer-a")
    assert engine.claim_due() is None
    assert engine.cancel_case(case) == 1

def test_failed_messages_never_claimed_as_delivered(setup):
    store, engine = setup
    case = make_case(store)
    mid = engine.schedule_update(case, "Review completed", "event-b",
                                 verified_case_event=True)
    engine.claim_due()
    engine.complete(mid, delivered=False)
    status = store.db.execute(
        "SELECT status FROM notifications WHERE id=?", (mid,)).fetchone()["status"]
    assert status == "failed"

def test_invalid_unverified_access(setup):
    store, engine = setup
    case = make_case(store)
    with pytest.raises(ValueError):
        engine.add_turn(case, "agent", "")
    with pytest.raises(ValueError):
        engine.schedule_update(case, "update", "event-x",
                               due_at=datetime(2026,11,1), verified_case_event=True)
