"""Durable, provider-independent citizen intake and case follow-up foundation.

Sandbox-ready local SQLite implementation. Caller ID is not identity proof.
No official police integration or automated case closure is implied.
"""
from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

PRIORITIES = {"P0", "P1", "P2", "P3"}
DISPOSITIONS = {"REFERRED", "TRANSFERRED", "DUPLICATE", "WITHDRAWN", "CLOSED_BY_AUTHORITY"}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


class CitizenCaseStore:
    """Persist contacts, complaints, updates and an append-only event log."""

    def __init__(self, path: str | Path):
        self.db = sqlite3.connect(str(path))
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA foreign_keys=ON")
        self.db.executescript("""
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY, channel TEXT NOT NULL, caller_hint TEXT,
          safe_to_contact INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS cases (
          id TEXT PRIMARY KEY, contact_id TEXT NOT NULL REFERENCES contacts(id),
          priority TEXT NOT NULL, status TEXT NOT NULL, narrative TEXT NOT NULL,
          language TEXT NOT NULL, owner TEXT, next_update_at TEXT,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY, case_id TEXT NOT NULL REFERENCES cases(id),
          kind TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL
        );
        """)
        self.db.commit()

    def contact(self, channel: str, caller_hint: str | None = None,
                safe_to_contact: bool = False) -> str:
        if channel not in {"phone", "whatsapp", "web"}:
            raise ValueError("unrecognized contact channel")
        contact_id = str(uuid.uuid4())
        with self.db:
            self.db.execute("INSERT INTO contacts VALUES (?,?,?,?,?)",
                            (contact_id, channel, caller_hint, int(safe_to_contact), now()))
        return contact_id

    def open_case(self, contact_id: str, narrative: str, language: str = "ml",
                  priority: str = "P2") -> str:
        if priority not in PRIORITIES:
            raise ValueError("invalid priority")
        if not narrative.strip():
            raise ValueError("complaint narrative required")
        case_id = "AZR-" + uuid.uuid4().hex[:12].upper()
        timestamp = now()
        with self.db:
            self.db.execute(
                "INSERT INTO cases VALUES (?,?,?,?,?,?,?,?,?)",
                (case_id, contact_id, priority, "INTAKE", narrative, language,
                 None, None, timestamp))
            self._event(case_id, "complaint_received", {"source": "citizen"})
        return case_id

    def _event(self, case_id: str, kind: str, payload: dict[str, Any]) -> None:
        self.db.execute("INSERT INTO events VALUES (?,?,?,?,?)",
                        (str(uuid.uuid4()), case_id, kind,
                         json.dumps(payload, sort_keys=True), now()))

    def assign(self, case_id: str, officer_id: str,
               update_after: timedelta = timedelta(days=1)) -> None:
        if not officer_id.strip():
            raise ValueError("officer identifier required")
        due = (datetime.now(timezone.utc) + update_after).isoformat()
        with self.db:
            changed = self.db.execute(
                "UPDATE cases SET owner=?,status='ASSIGNED',next_update_at=? "
                "WHERE id=? AND status NOT IN ('CLOSED_BY_AUTHORITY','WITHDRAWN')",
                (officer_id, due, case_id)).rowcount
            if not changed:
                raise ValueError("case absent or not assignable")
            self._event(case_id, "assigned", {"officer_id": officer_id})

    def update(self, case_id: str, note: str, actor: str, verified: bool = False) -> None:
        if not note.strip() or not actor.strip():
            raise ValueError("note and actor required")
        with self.db:
            if self.db.execute("SELECT 1 FROM cases WHERE id=?", (case_id,)).fetchone() is None:
                raise ValueError("case not found")
            self._event(case_id, "case_update", {
                "actor": actor, "note": note, "verified": verified})

    def eligible_outbound(self, case_id: str) -> bool:
        row = self.db.execute(
            "SELECT c.safe_to_contact, k.status FROM cases k "
            "JOIN contacts c ON c.id=k.contact_id WHERE k.id=?", (case_id,)
        ).fetchone()
        return bool(row and row["safe_to_contact"] and row["status"] != "CLOSED_BY_AUTHORITY")

    def overdue(self, at: datetime | None = None) -> list[str]:
        current = (at or datetime.now(timezone.utc)).isoformat()
        return [row["id"] for row in self.db.execute(
            "SELECT id FROM cases WHERE owner IS NOT NULL AND next_update_at <= ? "
            "AND status NOT IN ('CLOSED_BY_AUTHORITY','WITHDRAWN')",
            (current,)).fetchall()]

    def disposition(self, case_id: str, outcome: str, officer_id: str) -> None:
        if outcome not in DISPOSITIONS:
            raise ValueError("invalid disposition")
        if not officer_id.strip():
            raise PermissionError("authorized officer required")
        with self.db:
            changed = self.db.execute(
                "UPDATE cases SET status=?,next_update_at=NULL WHERE id=? AND owner=?",
                (outcome, case_id, officer_id)).rowcount
            if not changed:
                raise PermissionError("only assigned officer may record disposition")
            self._event(case_id, "officer_disposition", {
                "officer_id": officer_id, "outcome": outcome})

    def history(self, case_id: str) -> list[dict[str, Any]]:
        return [{"kind": x["kind"], "payload": json.loads(x["payload"]),
                 "created_at": x["created_at"]}
                for x in self.db.execute(
                    "SELECT kind,payload,created_at FROM events WHERE case_id=? ORDER BY rowid",
                    (case_id,)).fetchall()]

    def close(self) -> None:
        self.db.close()
