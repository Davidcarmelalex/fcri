import pytest
from app import tasks


def test_submit_and_list(monkeypatch, tmp_path):
    monkeypatch.setattr(tasks, "DB_PATH", tmp_path / "tasks.db")
    task = tasks.submit("research", "Summarize a scientific method")
    assert task["state"] == "pending"
    assert tasks.get(task["id"])["agent"] == "research"
    assert len(tasks.list_tasks()) == 1


def test_reject_invalid_agent(monkeypatch, tmp_path):
    monkeypatch.setattr(tasks, "DB_PATH", tmp_path / "tasks.db")
    with pytest.raises(ValueError):
        tasks.submit("admin", "test")


def test_execute_once(monkeypatch, tmp_path):
    monkeypatch.setattr(tasks, "DB_PATH", tmp_path / "tasks.db")
    monkeypatch.setattr(tasks, "run_agent", lambda prompt: {"answer":"done"})
    task = tasks.submit("operations", "Produce an agenda")
    finished = tasks.execute(task["id"])
    assert finished["state"] == "completed"
    assert finished["result"] == "done"
    with pytest.raises(ValueError):
        tasks.execute(task["id"])
