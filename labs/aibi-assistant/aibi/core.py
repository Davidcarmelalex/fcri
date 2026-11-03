"""Server-owned identity, tenant boundaries and approval transactions.

Only the mock adapter ships. Untrusted text never becomes executable code.
"""
from __future__ import annotations

import hashlib
import json
import secrets
import sqlite3
import time
import uuid
from contextlib import contextmanager
from dataclasses import dataclass

from .vendor.agent47 import Agent47, Task, TaskResult

ROLES = {"admin", "executive", "operations", "admissions", "finance", "staff"}
READ = {
    "calendar": ROLES,
    "tasks": ROLES,
    "meetings": {"admin", "executive", "operations"},
    "enrollments": {"admin", "executive", "admissions"},
    "sales": {"admin", "executive", "admissions", "finance"},
    "staffing": {"admin", "executive", "operations"},
    "expenses": {"admin", "executive", "finance"},
}
POLICY = {
    "task.create": ({"admin", "executive", "operations", "staff"}, None),
    "meeting.record": ({"admin", "executive", "operations"}, None),
    "calendar.create": ({"admin", "executive", "operations"}, {"admin", "executive"}),
    "outbound.send": ({"admin", "executive", "operations", "admissions"}, {"admin", "executive"}),
    "expense.pay": ({"admin", "executive", "finance"}, {"admin", "executive", "finance"}),
    "record.delete": ({"admin"}, {"admin"}),
    "retention.set": ({"admin"}, {"admin"}),
}


class Problem(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


def require(ok, status=403, message="Permission denied"):
    if not ok:
        raise Problem(status, message)


def encoded(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value):
    return hashlib.sha256(encoded(value).encode()).hexdigest()


@dataclass(frozen=True)
class Principal:
    tenant: str
    user: str
    role: str


class ScopedAgent47(Agent47):
    """Reuse Agent47's dispatch interface, never its command executor/history.

    A fresh instance lives inside an authenticated transaction. The only dispatch
    accepted is an allowlisted skill with a validated structured payload.
    """
    def __init__(self, adapter):
        self.adapter = adapter

    async def execute(self, task: Task) -> TaskResult:
        if task.type != "skill" or not isinstance(task.payload, dict):
            return TaskResult(task.id, False, error="Only structured AIBI skills are allowed")
        operation = task.payload.get("operation")
        if operation not in POLICY:
            return TaskResult(task.id, False, error="Unknown AIBI skill")
        return TaskResult(task.id, True, output=self.adapter(operation, task.payload["data"]))

    def get_history(self, limit=50):
        raise Problem(403, "Use the tenant-scoped audit endpoint")


class Store:
    def __init__(self, path):
        self.path = str(path)
        with self.connection() as c:
            c.executescript("""
            PRAGMA journal_mode=WAL;
            CREATE TABLE IF NOT EXISTS tenants (
                id TEXT PRIMARY KEY, retention_days INTEGER NOT NULL DEFAULT 30,
                audit_days INTEGER NOT NULL DEFAULT 365);
            CREATE TABLE IF NOT EXISTS users (
                tenant TEXT, id TEXT, role TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1,
                PRIMARY KEY(tenant,id));
            CREATE TABLE IF NOT EXISTS tokens (
                hash TEXT PRIMARY KEY, tenant TEXT, user TEXT, expires REAL NOT NULL);
            CREATE TABLE IF NOT EXISTS records (
                tenant TEXT, id TEXT, kind TEXT, owner TEXT, data TEXT, created REAL,
                PRIMARY KEY(tenant,id));
            CREATE TABLE IF NOT EXISTS actions (
                tenant TEXT, id TEXT, requester TEXT, operation TEXT, payload TEXT,
                digest TEXT, state TEXT, approver TEXT, created REAL, expires REAL,
                result TEXT, idempotency TEXT, PRIMARY KEY(tenant,id),
                UNIQUE(tenant,requester,idempotency));
            CREATE TABLE IF NOT EXISTS audit (
                sequence INTEGER PRIMARY KEY AUTOINCREMENT, tenant TEXT, actor TEXT,
                event TEXT, object_id TEXT, created REAL);
            """)

    @contextmanager
    def connection(self):
        c = sqlite3.connect(self.path, timeout=10, isolation_level=None)
        c.row_factory = sqlite3.Row
        try:
            c.execute("BEGIN IMMEDIATE")
            yield c
            c.commit()
        except Exception:
            c.rollback()
            raise
        finally:
            c.close()

    def issue_token(self, tenant, user, role, hours=12):
        require(role in ROLES and 0 < hours <= 24 and 0 < len(tenant) <= 100
                and 0 < len(user) <= 100, 400, "Invalid identity or token lifetime")
        token = secrets.token_urlsafe(48)
        with self.connection() as c:
            c.execute("INSERT OR IGNORE INTO tenants(id) VALUES (?)", (tenant,))
            c.execute("INSERT INTO users(tenant,id,role) VALUES (?,?,?) ON CONFLICT(tenant,id) DO UPDATE SET role=excluded.role, active=1", (tenant, user, role))
            c.execute("INSERT INTO tokens VALUES (?,?,?,?)", (hashlib.sha256(token.encode()).hexdigest(), tenant, user, time.time()+hours*3600))
            self.audit(c, Principal(tenant, user, role), "credential.issued", user)
        return token

    def revoke(self, tenant, user):
        with self.connection() as c:
            c.execute("UPDATE users SET active=0 WHERE tenant=? AND id=?", (tenant, user))
            c.execute("DELETE FROM tokens WHERE tenant=? AND user=?", (tenant, user))
            self.audit(c, Principal(tenant, "local-admin", "admin"), "credential.revoked", user)

    def authenticate(self, c, token):
        require(isinstance(token, str) and 0 < len(token) <= 256, 401, "Invalid credential")
        r = c.execute("SELECT u.tenant,u.id,u.role FROM tokens t JOIN users u ON u.tenant=t.tenant AND u.id=t.user WHERE t.hash=? AND t.expires>? AND u.active=1", (hashlib.sha256(token.encode()).hexdigest(), time.time())).fetchone()
        require(r is not None, 401, "Invalid or expired credential")
        return Principal(r["tenant"], r["id"], r["role"])

    def audit(self, c, p, event, object_id=""):
        # No prompts, payloads, tokens, amounts or personal information in audit.
        c.execute("INSERT INTO audit(tenant,actor,event,object_id,created) VALUES (?,?,?,?,?)", (p.tenant, p.user, event, object_id, time.time()))

    def read(self, c, p, kind):
        require(kind in READ and p.role in READ[kind])
        sql = "SELECT id,owner,data,created FROM records WHERE tenant=? AND kind=? AND created>?"
        days = c.execute("SELECT retention_days FROM tenants WHERE id=?", (p.tenant,)).fetchone()[0]
        args = [p.tenant, kind, time.time()-days*86400]
        # Personal staff views cannot expose other users' calendar or tasks.
        if p.role == "staff":
            sql += " AND owner=?"
            args.append(p.user)
        rows = c.execute(sql+" ORDER BY created DESC LIMIT 200", args).fetchall()
        self.audit(c, p, "read."+kind)
        return [dict(id=r["id"], owner=r["owner"], data=json.loads(r["data"]), created=r["created"]) for r in rows]

    def insert_record(self, c, p, kind, data, owner=None):
        rid = str(uuid.uuid4())
        c.execute("INSERT INTO records VALUES (?,?,?,?,?,?)", (p.tenant, rid, kind, owner or p.user, encoded(data), time.time()))
        return rid

    def validate(self, operation, data):
        require(operation in POLICY and isinstance(data, dict), 400, "Unknown operation or invalid data")
        fields = {
            "task.create": ({"title", "owner", "due"}, {"title"}),
            "meeting.record": ({"title", "notes", "actions"}, {"title", "notes", "actions"}),
            "calendar.create": ({"title", "start", "end", "attendees"}, {"title", "start", "end", "attendees"}),
            "outbound.send": ({"recipient", "message"}, {"recipient", "message"}),
            "expense.pay": ({"payee", "amount_minor", "currency"}, {"payee", "amount_minor", "currency"}),
            "record.delete": ({"record_id", "reason"}, {"record_id", "reason"}),
            "retention.set": ({"retention_days", "audit_days"}, {"retention_days", "audit_days"}),
        }
        allowed, required = fields[operation]
        require(set(data) <= allowed and required <= set(data), 400, "Invalid payload fields")
        require(len(encoded(data)) <= 16000, 400, "Payload too large")
        for key, value in data.items():
            if key not in {"actions", "attendees", "amount_minor", "retention_days", "audit_days"}:
                require(isinstance(value, str) and 0 < len(value) <= 8000, 400, "Invalid text field")
        if operation == "meeting.record":
            require(isinstance(data["actions"], list) and len(data["actions"]) <= 30, 400, "Invalid action items")
            for item in data["actions"]:
                self.validate("task.create", item)
        if operation == "calendar.create":
            from datetime import datetime
            try:
                start, end = (datetime.fromisoformat(data[k]) for k in ("start", "end"))
                valid = start.tzinfo is not None and end.tzinfo is not None and end > start
            except (ValueError, TypeError):
                valid = False
            require(valid, 400, "Use timezone-aware dates with end after start")
            require(isinstance(data["attendees"], list) and len(data["attendees"]) <= 50
                    and all(isinstance(x, str) and 0 < len(x) <= 254 for x in data["attendees"]), 400, "Invalid attendees")
        if operation == "expense.pay":
            require(type(data["amount_minor"]) is int and 0 < data["amount_minor"] <= 100000000
                    and data["currency"] == "INR", 400, "Use positive INR minor units")
        if operation == "retention.set":
            require(all(type(data[k]) is int and 1 <= data[k] <= 3650 for k in data), 400, "Retention must be 1–3650 days")

    def propose(self, c, p, operation, data, key):
        self.validate(operation, data)
        require(p.role in POLICY[operation][0])
        require(isinstance(key, str) and 8 <= len(key) <= 100, 400, "Idempotency key required (8–100 characters)")
        if operation == "task.create" and p.role == "staff":
            require(data.get("owner", p.user) == p.user)
        owners = [data.get("owner")] if operation == "task.create" else [x.get("owner") for x in data.get("actions", [])]
        for owner in owners:
            if owner:
                require(c.execute("SELECT 1 FROM users WHERE tenant=? AND id=? AND active=1", (p.tenant, owner)).fetchone() is not None, 400, "Unknown assignee")
        fingerprint = digest({"operation": operation, "data": data})
        old = c.execute("SELECT * FROM actions WHERE tenant=? AND requester=? AND idempotency=?", (p.tenant, p.user, key)).fetchone()
        if old:
            require(old["digest"] == fingerprint, 409, "Idempotency key already used for different content")
            return self.action_view(old)
        aid = str(uuid.uuid4())
        state = "pending" if POLICY[operation][1] else "ready"
        now = time.time()
        c.execute("INSERT INTO actions VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", (p.tenant, aid, p.user, operation, encoded(data), fingerprint, state, None, now, now+86400, None, key))
        self.audit(c, p, "action.proposed", aid)
        if state == "ready":
            self.execute(c, p, aid)
        return self.action_view(self.action(c, p, aid))

    def action(self, c, p, aid):
        row = c.execute("SELECT * FROM actions WHERE tenant=? AND id=?", (p.tenant, aid)).fetchone()
        require(row is not None, 404, "Action not found")
        return row

    def action_view(self, r):
        return {k: json.loads(r[k]) if k in {"payload", "result"} and r[k] else r[k]
                for k in ("id", "requester", "operation", "payload", "digest", "state", "approver", "created", "expires", "result")}

    def visible_actions(self, c, p):
        days = c.execute("SELECT retention_days FROM tenants WHERE id=?", (p.tenant,)).fetchone()[0]
        rows = c.execute("SELECT * FROM actions WHERE tenant=? AND created>? ORDER BY created DESC LIMIT 200", (p.tenant, time.time()-86400*days)).fetchall()
        self.audit(c, p, "actions.read")
        return [self.action_view(r) for r in rows if r["requester"] == p.user or p.role in (POLICY[r["operation"]][1] or set())]

    def decide(self, c, p, aid, fingerprint, approve):
        r = self.action(c, p, aid)
        require(p.role in (POLICY[r["operation"]][1] or set()))
        require(p.user != r["requester"], 403, "A different user must review this action")
        require(r["state"] == "pending" and r["expires"] > time.time(), 409, "Action is no longer pending")
        require(fingerprint == r["digest"], 409, "Review digest does not match")
        c.execute("UPDATE actions SET state=?,approver=? WHERE tenant=? AND id=?", ("approved" if approve else "rejected", p.user, p.tenant, aid))
        self.audit(c, p, "action.approved" if approve else "action.rejected", aid)
        return self.action_view(self.action(c, p, aid))

    def execute(self, c, p, aid):
        import asyncio
        r = self.action(c, p, aid)
        require(p.user == r["requester"], 403, "Only requester can execute")
        require(p.role in POLICY[r["operation"]][0])
        if r["state"] == "completed":
            return self.action_view(r)
        expected = "approved" if POLICY[r["operation"]][1] else "ready"
        require(r["state"] == expected and r["expires"] > time.time(), 409, "Valid approval required")
        if r["approver"]:
            approver = c.execute("SELECT role,active FROM users WHERE tenant=? AND id=?", (p.tenant, r["approver"])).fetchone()
            require(approver and approver["active"] and approver["role"] in POLICY[r["operation"]][1], 409, "Approver no longer authorized")
        data = json.loads(r["payload"])
        self.validate(r["operation"], data)
        require(digest({"operation": r["operation"], "data": data}) == r["digest"], 409, "Action integrity mismatch")
        agent = ScopedAgent47(lambda op, payload: self.mock_effect(c, p, op, payload))
        result = asyncio.run(agent.execute(Task(id=aid, type="skill", payload={"operation": r["operation"], "data": data})))
        require(result.success, 500, "Execution failed")
        c.execute("UPDATE actions SET state='completed',result=? WHERE tenant=? AND id=?", (encoded(result.output), p.tenant, aid))
        self.audit(c, p, "action.completed", aid)
        return self.action_view(self.action(c, p, aid))

    def mock_effect(self, c, p, op, data):
        if op == "task.create":
            rid = self.insert_record(c, p, "tasks", {**data, "status": "open"}, data.get("owner"))
        elif op == "meeting.record":
            rid = self.insert_record(c, p, "meetings", data)
            for item in data["actions"]:
                self.insert_record(c, p, "tasks", {**item, "meeting_id": rid, "status": "open"}, item.get("owner"))
        elif op == "calendar.create":
            rid = self.insert_record(c, p, "calendar", data)
        elif op == "record.delete":
            require(c.execute("SELECT 1 FROM records WHERE tenant=? AND id=?", (p.tenant, data["record_id"])).fetchone() is not None, 404, "Record not found")
            c.execute("DELETE FROM records WHERE tenant=? AND id=?", (p.tenant, data["record_id"]))
            rid = data["record_id"]
        elif op == "retention.set":
            c.execute("UPDATE tenants SET retention_days=?,audit_days=? WHERE id=?", (data["retention_days"], data["audit_days"], p.tenant))
            rid = p.tenant
        else:
            # Simulation only. No network, payment or messaging client exists.
            rid = str(uuid.uuid4())
        return {"mode": "mock", "reference": rid, "external_action_performed": False}

    def briefing(self, c, p, language="en"):
        require(language in {"en", "ml"}, 400, "Language must be en or ml")
        data = {kind: self.read(c, p, kind) for kind in READ if p.role in READ[kind]}
        return {"language": language, "mode": "mock", "title": "Executive briefing" if language == "en" else "നിർവാഹക സംക്ഷിപ്ത റിപ്പോർട്ട്",
                "notice": "Demonstration data; no campus systems connected." if language == "en" else "ഇത് മാതൃകാ ഡാറ്റയാണ്. ക്യാമ്പസ് സംവിധാനങ്ങളുമായി ബന്ധിപ്പിച്ചിട്ടില്ല.",
                "counts": {k: len(v) for k, v in data.items()}, "sections": data}

    def purge(self, tenant):
        with self.connection() as c:
            policy = c.execute("SELECT * FROM tenants WHERE id=?", (tenant,)).fetchone()
            require(policy is not None, 404, "Tenant not found")
            cutoff = time.time()-policy["retention_days"]*86400
            for table in ("records", "actions"):
                c.execute(f"DELETE FROM {table} WHERE tenant=? AND created<?", (tenant, cutoff))
            c.execute("DELETE FROM audit WHERE tenant=? AND created<?", (tenant, time.time()-policy["audit_days"]*86400))
            c.execute("DELETE FROM tokens WHERE tenant=? AND expires<?", (tenant, time.time()))
            self.audit(c, Principal(tenant, "retention-job", "admin"), "retention.purged")

    def seed(self, tenant, user):
        with self.connection() as c:
            require(c.execute("SELECT 1 FROM users WHERE tenant=? AND id=?", (tenant, user)).fetchone() is not None, 400, "Provision the demo user first")
            require(c.execute("SELECT 1 FROM records WHERE tenant=?", (tenant,)).fetchone() is None, 409, "Tenant already contains records")
            p = Principal(tenant, user, "admin")
            examples = {
                "tasks": {"title": "Review course launch checklist", "status": "open"},
                "calendar": {"title": "Campus review", "start": "2026-10-23T09:00:00+05:30", "end": "2026-10-23T09:30:00+05:30"},
                "meetings": {"title": "Sample admissions review", "notes": "മാതൃകാ യോഗ കുറിപ്പുകൾ", "actions": []},
                "enrollments": {"course": "Sample course A", "enrolled": 24, "capacity": 30},
                "sales": {"course": "Sample course A", "leads": 60, "enrollments": 24, "collected_minor": 2400000, "currency": "INR"},
                "staffing": {"team": "Sample teaching team", "scheduled_hours": 32, "available_hours": 40},
                "expenses": {"category": "Sample campus operations", "amount_minor": 125000, "currency": "INR", "status": "pending"},
            }
            for kind, data in examples.items():
                self.insert_record(c, p, kind, data)
            self.audit(c, p, "demo.seeded")
