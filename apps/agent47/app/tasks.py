"""Persistent, explicitly triggered task queue; no autonomous side effects."""
import json
import os
import sqlite3
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from .runtime import run_agent

_LOCK = threading.Lock()
DB_PATH = Path(os.getenv("AGENT47_TASK_DB_PATH", "/tmp/agent47-tasks.db"))
AGENT_IDS = frozenset({"research", "operations", "security", "media"})


def connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH, timeout=15)
    db.row_factory = sqlite3.Row
    db.execute("""CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY, agent TEXT NOT NULL, prompt TEXT NOT NULL,
        state TEXT NOT NULL, result TEXT, error TEXT, created TEXT NOT NULL,
        updated TEXT NOT NULL)""")
    return db


def submit(agent, prompt):
    if agent not in AGENT_IDS:
        raise ValueError("Unknown agent")
    if not isinstance(prompt, str) or not 1 <= len(prompt.strip()) <= 8000:
        raise ValueError("Prompt must contain 1-8000 characters")
    task_id = uuid.uuid4().hex
    now = datetime.now(timezone.utc).isoformat()
    with _LOCK, connect() as db:
        db.execute("INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?)",
                   (task_id, agent, prompt, "pending", None, None, now, now))
    return get(task_id)


def get(task_id):
    with connect() as db:
        row = db.execute("SELECT id,agent,state,result,error,created,updated FROM tasks WHERE id=?", (task_id,)).fetchone()
    if row is None:
        raise KeyError("Task not found")
    return dict(row)


def list_tasks(limit=50):
    with connect() as db:
        return [dict(r) for r in db.execute("SELECT id,agent,state,result,error,created,updated FROM tasks ORDER BY created DESC LIMIT ?", (min(max(limit,1),100),))]


def execute(task_id):
    """Runs a pending task synchronously on explicit request. No remote shell or other tools."""
    with _LOCK, connect() as db:
        row = db.execute("SELECT agent,prompt,state FROM tasks WHERE id=?", (task_id,)).fetchone()
        if row is None:
            raise KeyError("Task not found")
        if row["state"] != "pending":
            raise ValueError("Task must be pending")
        now = datetime.now(timezone.utc).isoformat()
        db.execute("UPDATE tasks SET state='running',updated=? WHERE id=?", (now,task_id))
        prompt, agent = row["prompt"], row["agent"]
    try:
        response = run_agent(
            "You are operating in the " + agent + " division. Answer the following task; "
            "do not claim to have used tools that are unavailable.\n\n" + prompt
        )
        result, state, error = response["answer"], "completed", None
    except Exception:
        result, state, error = None, "failed", "Model execution failed; check server logs"
    with _LOCK, connect() as db:
        db.execute("UPDATE tasks SET state=?,result=?,error=?,updated=? WHERE id=?",
                   (state,result,error,datetime.now(timezone.utc).isoformat(),task_id))
    return get(task_id)
