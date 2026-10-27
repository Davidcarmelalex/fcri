import json
import socket
from pathlib import Path
import sys
from threading import Thread
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pytest

DEMO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(DEMO_ROOT))
from engine import DemoError, DemoSession
from server import create_server


def incident(session, name="credential-stuffing"):
    return session.create_incident(name)["incidents"][0]


def test_real_policy_denial_approval_execution_and_replay():
    session = DemoSession()
    item = incident(session)
    with pytest.raises(DemoError):
        session.execute(item["id"])
    assert session.executor.calls == []
    assert session.snapshot()["audit"][-1]["event"] == "execution_denied"
    assert session.snapshot()["stats"]["blocked"] == 1
    session.approve(item["id"])
    result = session.execute(item["id"])
    assert result["incidents"][0]["status"] == "contained"
    assert len(session.executor.calls) == 1
    with pytest.raises(DemoError):
        session.execute(item["id"])
    assert len(session.executor.calls) == 1
    assert session.snapshot()["stats"]["blocked"] == 2


def test_critical_quarantine_still_requires_approval():
    session = DemoSession()
    item = incident(session, "ransomware")
    assert item["severity"] == "critical" and item["approvalRequired"]
    with pytest.raises(DemoError):
        session.execute(item["id"])
    assert not session.executor.calls


def test_low_alert_executes_without_approval():
    session = DemoSession()
    item = incident(session, "suspicious-login")
    assert not item["approvalRequired"]
    assert session.execute(item["id"])["stats"]["contained"] == 1


def test_rejection_revokes_approval_and_prevents_execution():
    session = DemoSession()
    item = incident(session)
    session.approve(item["id"])
    session.reject(item["id"])
    with pytest.raises(DemoError):
        session.execute(item["id"])
    assert not session.executor.calls
    assert "approval_revoked" in [r["event"] for r in session.snapshot()["audit"]]


def test_sessions_and_reset_are_isolated_and_bounded():
    first, second = DemoSession(), DemoSession()
    item = incident(first)
    with pytest.raises(DemoError) as error:
        second.execute(item["id"])
    assert error.value.status == 404
    original = first.session_id
    first.reset()
    assert first.session_id == original and first.snapshot()["stats"]["detected"] == 0
    for _ in range(first.MAX_INCIDENTS):
        incident(first)
    with pytest.raises(DemoError) as error:
        incident(first)
    assert error.value.status == 409


def test_only_supplied_synthetic_scenarios_are_accepted():
    session = DemoSession()
    with pytest.raises(DemoError):
        session.create_incident("https://real-target.example")
    assert session.snapshot()["incidents"] == []


def test_public_audit_history_is_bounded_after_repeated_denials():
    session = DemoSession()
    item = incident(session)
    for _ in range(220):
        with pytest.raises(DemoError):
            session.execute(item["id"])
        session.snapshot()
    assert len(session.core.audit.records) == 200
    assert session.executor.calls == []


@pytest.fixture
def http_demo():
    server = create_server(port=0)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    yield base
    server.shutdown()
    server.server_close()
    thread.join(timeout=2)


def request(base, route, payload=None, cookie=None, origin=True):
    headers = {}
    if cookie:
        headers["Cookie"] = cookie
    if origin:
        headers["Origin"] = base
    if payload is not None:
        headers["Content-Type"] = "application/json"
    req = Request(base + route, data=json.dumps(payload).encode() if payload is not None else None, headers=headers)
    try:
        response = urlopen(req, timeout=3)
    except HTTPError as exc:
        response = exc
    return response.status, response.headers, json.loads(response.read())


def test_http_session_isolation_csrf_and_control_field_validation(http_demo):
    status, headers, first = request(http_demo, "/api/session")
    assert status == 200
    assert "HttpOnly" in headers["Set-Cookie"] and "SameSite=Strict" in headers["Set-Cookie"]
    cookie = headers["Set-Cookie"].split(";")[0]
    status, _, denied = request(http_demo, "/api/scenario", {"scenario": "ransomware"}, cookie, origin=False)
    assert status == 403 and denied["incidents"] == []
    status, _, denied = request(http_demo, "/api/scenario", {"scenario": "ransomware", "target": "real-host"}, cookie)
    assert status == 400
    status, _, created = request(http_demo, "/api/scenario", {"scenario": "ransomware"}, cookie)
    assert status == 200 and len(created["incidents"]) == 1
    _, _, second = request(http_demo, "/api/session")
    assert second["sessionId"] != first["sessionId"] and second["incidents"] == []
    status, headers, exported = request(http_demo, "/api/export", cookie=cookie)
    assert status == 200 and "attachment" in headers["Content-Disposition"]
    assert exported["mode"] == "simulation"


def test_excess_connections_are_rejected_instead_of_starting_more_workers():
    server = create_server(port=0, max_workers=1)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    host, port = server.server_address
    first = socket.create_connection((host, port), timeout=2)
    try:
        # Leave the first HTTP headers incomplete, occupying the only worker.
        first.sendall(b"GET /healthz HTTP/1.0\r\n")
        with socket.create_connection((host, port), timeout=2) as second:
            second.sendall(b"GET /healthz HTTP/1.0\r\n\r\n")
            reply = second.recv(1024)
        assert b"503 Service Unavailable" in reply and b"Demo server busy" in reply
    finally:
        first.close()
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)
