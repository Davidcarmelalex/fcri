"""Deterministic provider integration tests without real API credentials."""
import httpx
import pytest
from app import runtime


class MockClient:
    responses = []
    requests = []

    def __init__(self, *args, **kwargs):
        assert kwargs["follow_redirects"] is False
        assert kwargs["trust_env"] is False

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def post(self, url, headers, json):
        self.requests.append(json)
        payload = self.responses.pop(0)
        return httpx.Response(200, json=payload, request=httpx.Request("POST", url))


def setup(monkeypatch, tmp_path, responses):
    monkeypatch.setattr(runtime, "DB_PATH", tmp_path / "messages.db")
    monkeypatch.setattr(runtime.httpx, "Client", MockClient)
    monkeypatch.setenv("AGENT47_MODEL_API_KEY", "fake-token")
    monkeypatch.setenv("AGENT47_MODEL_BASE_URL", "https://models.example/v1")
    monkeypatch.setenv("AGENT47_MODEL", "test-model")
    MockClient.responses = list(responses)
    MockClient.requests = []


def test_model_answer_persists_session(monkeypatch, tmp_path):
    setup(monkeypatch, tmp_path, [
        {"choices":[{"message":{"role":"assistant","content":"Answer one"}}]},
        {"choices":[{"message":{"role":"assistant","content":"Answer two"}}]},
    ])
    first = runtime.run_agent("Question one")
    second = runtime.run_agent("Question two", first["session"])
    assert first["answer"] == "Answer one"
    assert second["answer"] == "Answer two"
    assert [x["role"] for x in runtime.history(first["session"])] == ["user", "assistant", "user", "assistant"]
    assert any(m.get("content") == "Answer one" for m in MockClient.requests[-1]["messages"])


def test_session_isolation(monkeypatch, tmp_path):
    setup(monkeypatch, tmp_path, [
        {"choices":[{"message":{"role":"assistant","content":"Secret A"}}]},
        {"choices":[{"message":{"role":"assistant","content":"Response B"}}]},
    ])
    a = runtime.run_agent("Private request")
    runtime.run_agent("Another request")
    assert len(MockClient.requests[1]["messages"]) == 2
    assert "Secret A" not in str(MockClient.requests[1])
    assert len(runtime.history(a["session"])) == 2


def test_calculator_tool_roundtrip(monkeypatch, tmp_path):
    setup(monkeypatch, tmp_path, [
        {"choices":[{"message":{"role":"assistant","tool_calls":[
            {"id":"tool-1","type":"function","function":{"name":"calculate","arguments":'{"expression":"6*7"}'}}
        ]}}]},
        {"choices":[{"message":{"role":"assistant","content":"42"}}]},
    ])
    answer = runtime.run_agent("Calculate 6 times 7")
    assert answer["answer"] == "42"
    assert {"role":"tool","tool_call_id":"tool-1","content":"42"} in MockClient.requests[1]["messages"]


def test_rejects_too_many_tool_calls(monkeypatch, tmp_path):
    calls = [{"id":str(i),"type":"function","function":{"name":"calculate","arguments":'{"expression":"1+1"}'}} for i in range(4)]
    setup(monkeypatch, tmp_path, [{"choices":[{"message":{"role":"assistant","tool_calls":calls}}]}])
    with pytest.raises(RuntimeError, match="tool-call limit"):
        runtime.run_agent("Calculate")
