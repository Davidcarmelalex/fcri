"""AZRAEL Phase 1 conversation continuity and safe outbound task queue.

Local SQLite reference component. Access is granted only by a trusted
application layer after independent authentication. Never send messages
directly or treat phone-number equality as authentication.
"""
from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any
from .citizen_cases import CitizenCaseStore


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ContinuityEngine:
    def __init__(self, store: CitizenCaseStore):
        self.store = store
        self.db = store.db
        self.db.executescript("""
        CREATE TABLE IF NOT EXISTS dialogue (
            id TEXT PRIMARY KEY,
            case_id TEXT NOT NULL REFERENCES cases(id),
            role TEXT NOT NULL CHECK(role IN ('citizen', 'agent', 'officer')),
            content TEXT NOT NULL,
            language TEXT NOT NULL,
            source TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            case_id TEXT NOT NULL REFERENCES cases(id),
            event_key TEXT NOT NULL UNIQUE,
            content TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN
                ('pending','leased','delivered','failed','cancelled')),
            due_at TEXT NOT NULL,
            leased_until TEXT,
            attempts INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        );
        """)
        self.db.commit()

    def add_turn(self, case_id: str, role: str, content: str, language: str = "ml",
                 source: str = "voice") -> str:
        if role not in ("citizen", "agent", "officer") or source not in (
                "voice", "whatsapp", "web", "officer"):
            raise ValueError("unrecognized role/source")
        if not content.strip() or len(content) > 10000:
            raise ValueError("invalid turn content")
        turn_id = str(uuid.uuid4())
        with self.db:
            self.db.execute(
                "INSERT INTO dialogue VALUES (?,?,?,?,?,?,?)",
                (turn_id, case_id, role, content, language, source, utcnow().isoformat()))
        return turn_id

    def resume(self, case_id: str, *, identity_verified: bool = False,
               authorized_officer: bool = False) -> list[dict[str, Any]]:
        # Caller-ID and possession of a case reference are not sufficient.
        if not (identity_verified or authorized_officer):
            raise PermissionError("verified case access required")
        exists = self.db.execute("SELECT 1 FROM cases WHERE id=?", (case_id,)).fetchone()
        if not exists:
            raise LookupError("case not found")
        return [dict(r) for r in self.db.execute(
            "SELECT role,content,language,source,created_at "
            "FROM dialogue WHERE case_id=? ORDER BY rowid", (case_id,))]

    def schedule_update(self, case_id: str, content: str, event_key: str,
                        due_at: datetime | None = None,
                        *, verified_case_event: bool = False) -> str:
        # Do not fabricate police progress. Caller must supply a verified event.
        if not verified_case_event:
            raise PermissionError("verified case event required")
        if not content.strip() or not event_key.strip():
            raise ValueError("content and event_key required")
        if not self.store.eligible_outbound(case_id):
            raise PermissionError("unsafe or unconsented outbound update")
        if due_at is None:
            due_at = utcnow()
        if due_at.tzinfo is None:
            raise ValueError("timezone-aware timestamp required")
        message_id = str(uuid.uuid4())
        with self.db:
            self.db.execute(
                "INSERT OR IGNORE INTO notifications "
                "(id,case_id,event_key,content,status,due_at,created_at) "
                "VALUES (?,?,?,?,?,?,?)",
                (message_id, case_id, event_key, content, "pending",
                 due_at.astimezone(timezone.utc).isoformat(), utcnow().isoformat()))
            row = self.db.execute(
                "SELECT id FROM notifications WHERE event_key=?", (event_key,)
            ).fetchone()
            if row is None:
                raise RuntimeError("unable to schedule")
            return row["id"]

    def claim_due(self, at: datetime | None = None,
                  lease: timedelta = timedelta(minutes=2)) -> dict | None:
        """Atomic claim: safe for workers sharing one SQLite database."""
        current = at or utcnow()
        if current.tzinfo is None:
            raise ValueError("timezone-aware timestamp required")
        until = (current + lease).isoformat()
        with self.db:
            row = self.db.execute("""
                SELECT n.id,n.case_id,n.content,n.attempts
                FROM notifications n JOIN cases c ON c.id=n.case_id
                JOIN contacts t ON t.id=c.contact_id
                WHERE ((n.status='pending' AND n.due_at<=?)
                   OR (n.status='leased' AND n.leased_until<=?))
                   AND t.safe_to_contact=1
                   AND c.status NOT IN ('CLOSED_BY_AUTHORITY','WITHDRAWN')
                ORDER BY n.due_at,n.rowid LIMIT 1
            """, (current.isoformat(), current.isoformat())).fetchone()
            if not row:
                return None
            updated = self.db.execute(
                "UPDATE notifications SET status='leased',leased_until=?,"
                "attempts=attempts+1 WHERE id=?",
                (until, row["id"]))
            if updated.rowcount != 1:
                raise RuntimeError("could not claim notification")
            return {**dict(row), "attempts": row["attempts"] + 1}

    def complete(self, message_id: str, *, delivered: bool) -> None:
        # "delivered" must mean an acknowledgement from provider, not just an attempt.
        with self.db:
            count = self.db.execute(
                "UPDATE notifications SET status=?,leased_until=NULL "
                "WHERE id=? AND status='leased'",
                ("delivered" if delivered else "failed", message_id)).rowcount
            if count != 1:
                raise ValueError("message is not leased")

    def cancel_case(self, case_id: str) -> int:
        with self.db:
            return self.db.execute(
                "UPDATE notifications SET status='cancelled',leased_until=NULL "
                "WHERE case_id=? AND status IN ('pending','leased')",
                (case_id,)).rowcount
