import os
from fastapi.testclient import TestClient
from gateway.app import app, authenticate, osiris_base
from fastapi import HTTPException

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"

def test_reject_unknown_period():
    assert client.get("/api/public/earthquakes/year").status_code == 400

def test_private_denied_without_token(monkeypatch):
    monkeypatch.setenv("AGENT47_GATEWAY_TOKEN", "a" * 40)
    assert client.get("/api/private/osiris/health").status_code == 401

def test_private_disabled_without_osiris(monkeypatch):
    monkeypatch.setenv("AGENT47_GATEWAY_TOKEN", "a" * 40)
    monkeypatch.delenv("AGENT47_OSIRIS_URL", raising=False)
    assert client.get("/api/private/osiris/health", headers={"Authorization": "Bearer " + "a"*40}).status_code == 503

def test_block_external_osiris(monkeypatch):
    monkeypatch.setenv("AGENT47_OSIRIS_URL", "https://example.org")
    try:
        osiris_base()
        assert False
    except HTTPException as exc:
        assert exc.status_code == 503
