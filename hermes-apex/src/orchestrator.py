"""FCRI Hermes APEX: deterministic, no-network, approval-gated orchestration skeleton."""
from __future__ import annotations
import argparse, json, sqlite3, uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROLES = {r["id"]: r for r in json.loads((ROOT / "agents" / "registry.json").read_text())["roles"]}
DB = ROOT / "runtime" / "tasks.sqlite3"
def connect(path=DB):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("""CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, role TEXT NOT NULL, objective TEXT NOT NULL,
      status TEXT NOT NULL, approval TEXT NOT NULL, created_at TEXT NOT NULL)""")
    db.commit()
    return db
def submit(role, objective, db=None):
    if role not in ROLES: raise ValueError("Unknown role")
    if not objective.strip(): raise ValueError("Objective required")
    own = db is None
    db = db or connect()
    task_id = str(uuid.uuid4())
    db.execute("INSERT INTO tasks VALUES (?,?,?,?,?,?)",
      (task_id, role, objective, "pending_review", "required", datetime.now(timezone.utc).isoformat()))
    db.commit()
    if own: db.close()
    return task_id
def list_tasks(db=None):
    own = db is None
    db = db or connect()
    rows = db.execute("SELECT id,role,objective,status,approval,created_at FROM tasks ORDER BY created_at DESC").fetchall()
    if own: db.close()
    return [dict(zip(("id","role","objective","status","approval","created_at"), row)) for row in rows]
def main():
    p=argparse.ArgumentParser()
    p.add_argument("action",choices=["submit","list","roles"])
    p.add_argument("--role",default="scholar")
    p.add_argument("--objective",default="")
    args=p.parse_args()
    if args.action=="roles": print(json.dumps(list(ROLES),indent=2))
    elif args.action=="list": print(json.dumps(list_tasks(),indent=2))
    else: print(submit(args.role,args.objective))
if __name__=="__main__": main()
