from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_status_requires_configuration(monkeypatch):
    monkeypatch.delenv("AGENT47_API_KEY", raising=False)
    assert client.get("/v1/status").status_code == 503


def test_status_rejects_unauthorized(monkeypatch):
    monkeypatch.setenv("AGENT47_API_KEY", "a" * 40)
    assert client.get("/v1/status").status_code == 401


def test_status_with_key(monkeypatch):
    monkeypatch.setenv("AGENT47_API_KEY", "a" * 40)
    response = client.get("/v1/status", headers={"X-API-Key": "a" * 40})
    assert response.status_code == 200
    assert response.json()["execution_enabled"] is False
