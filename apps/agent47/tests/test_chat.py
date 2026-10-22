from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_chat_rejects_unauthenticated(monkeypatch):
    monkeypatch.setenv("AGENT47_API_KEY", "a" * 40)
    response = client.post("/v1/chat", json={"prompt": "hello"})
    assert response.status_code == 401


def test_chat_rejects_empty_prompt(monkeypatch):
    monkeypatch.setenv("AGENT47_API_KEY", "a" * 40)
    response = client.post("/v1/chat", headers={"X-API-Key": "a" * 40}, json={"prompt": ""})
    assert response.status_code == 422


def test_chat_without_model_provider(monkeypatch):
    monkeypatch.setenv("AGENT47_API_KEY", "a" * 40)
    monkeypatch.delenv("AGENT47_MODEL_API_KEY", raising=False)
    response = client.post("/v1/chat", headers={"X-API-Key": "a" * 40}, json={"prompt": "hello"})
    assert response.status_code == 400


def test_dashboard():
    response = client.get("/")
    assert response.status_code == 200
    assert "COMMAND CHAT" in response.text
    assert "Content-Security-Policy" in response.headers
