from datetime import datetime, timedelta, timezone
import pytest
from azrael_core.citizen_cases import CitizenCaseStore


@pytest.fixture
def store(tmp_path):
    s = CitizenCaseStore(tmp_path / "cases.sqlite")
    yield s
    s.close()


def test_anonymous_call_creates_durable_case(store):
    contact = store.contact("phone")
    case = store.open_case(contact, "Financial loss reported", "ml", "P0")
    assert case.startswith("AZR-")
    assert store.history(case)[0]["kind"] == "complaint_received"
    assert not store.eligible_outbound(case)


def test_caller_id_does_not_grant_contact_consent(store):
    contact = store.contact("phone", caller_hint="+911111111111")
    case = store.open_case(contact, "Received suspicious call")
    assert not store.eligible_outbound(case)


def test_case_guardian_tracks_overdue_and_officer_disposition(store):
    contact = store.contact("whatsapp", safe_to_contact=True)
    case = store.open_case(contact, "Received fraudulent payment link")
    store.assign(case, "officer-123", update_after=timedelta(seconds=-1))
    assert store.eligible_outbound(case)
    assert case in store.overdue()
    store.update(case, "Bank notification received", actor="officer-123", verified=True)
    with pytest.raises(PermissionError):
        store.disposition(case, "CLOSED_BY_AUTHORITY", officer_id="other")
    store.disposition(case, "CLOSED_BY_AUTHORITY", officer_id="officer-123")
    assert case not in store.overdue()
    assert not store.eligible_outbound(case)
    assert store.history(case)[-1]["kind"] == "officer_disposition"


def test_invalid_inputs_fail_closed(store):
    with pytest.raises(ValueError):
        store.contact("untrusted-channel")
    contact = store.contact("phone")
    with pytest.raises(ValueError):
        store.open_case(contact, "  ")
    with pytest.raises(ValueError):
        store.open_case(contact, "report", priority="P9")
