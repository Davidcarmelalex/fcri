#!/usr/bin/env python3
"""Portable evidence-ledger structural verifier; never substitutes for independent review."""
from __future__ import annotations

import datetime as dt
import json
import math
import re
import sys
from pathlib import Path

IDS = tuple(f"M{i}" for i in range(9))
STATES = {"PASS", "FAIL", "BLOCKED"}
SHA = re.compile(r"^[a-fA-F0-9]{40}(?:[a-fA-F0-9]{24})?$")


def _weight(value, name):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"{name}: weight must be a finite positive number")
    return value


def _timestamp(value, name):
    if not isinstance(value, str) or not value.endswith("Z"):
        raise ValueError(f"{name}: timestamp must be UTC ISO-8601 ending in Z")
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(f"{name}: invalid timestamp") from exc
    if parsed.utcoffset() != dt.timedelta(0):
        raise ValueError(f"{name}: timestamp must be UTC")


def _evidence(items, name, *, required):
    if not isinstance(items, list) or (required and not items):
        raise ValueError(f"{name}: evidence list required")
    for item in items:
        if not isinstance(item, dict):
            raise ValueError(f"{name}: evidence must be structured records")
        for field in ("source_sha", "command", "environment", "timestamp", "outcome", "reference"):
            if not isinstance(item.get(field), str) or not item[field].strip():
                raise ValueError(f"{name}: evidence missing {field}")
        if not SHA.fullmatch(item["source_sha"]):
            raise ValueError(f"{name}: invalid evidence source_sha")
        _timestamp(item["timestamp"], name)
        if item["outcome"] not in STATES:
            raise ValueError(f"{name}: invalid evidence outcome")
        if required and item["outcome"] != "PASS":
            raise ValueError(f"{name}: PASS requires passing evidence")


def _review(check, name):
    decision = check.get("review")
    if not isinstance(decision, dict):
        raise ValueError(f"{name}: PASS lacks independent review")
    reviewer, implementer = decision.get("reviewer"), decision.get("implementer")
    if not isinstance(reviewer, str) or not reviewer.strip() or not isinstance(implementer, str) or not implementer.strip():
        raise ValueError(f"{name}: reviewer and implementer identities required")
    if reviewer.strip().casefold() == implementer.strip().casefold():
        raise ValueError(f"{name}: self-review forbidden")
    if decision.get("verdict") != "PASS":
        raise ValueError(f"{name}: PASS requires reviewer PASS verdict")
    _timestamp(decision.get("decision_at"), name)
    return implementer.strip().casefold()


def validate(data):
    if not isinstance(data, dict) or data.get("schema_version") != 2:
        raise ValueError("unsupported ledger schema: expected v2 check-level evidence")
    if not isinstance(data.get("project"), str) or not data["project"].strip() or not isinstance(data.get("canonical_repository"), str) or not data["canonical_repository"].strip():
        raise ValueError("project and repository required")
    phases = data.get("phases")
    if not isinstance(phases, list) or len(phases) != len(IDS) or any(not isinstance(p, dict) for p in phases) or [p.get("id") for p in phases] != list(IDS):
        raise ValueError("M0..M8 required in order")
    total = verified = 0
    checked_ids = set()
    for phase in phases:
        phase_id = phase["id"]
        phase_weight = _weight(phase.get("weight"), phase_id)
        total += phase_weight
        if phase.get("status") not in STATES:
            raise ValueError(f"{phase_id}: invalid phase status")
        checks = phase.get("checks")
        if not isinstance(checks, list) or not checks:
            raise ValueError(f"{phase_id}: nonempty checks required")
        subtotal = 0
        implementers = set()
        for check in checks:
            if not isinstance(check, dict):
                raise ValueError(f"{phase_id}: invalid check")
            check_id = check.get("id")
            if not isinstance(check_id, str) or not re.fullmatch(re.escape(phase_id) + r"-C[1-9][0-9]*", check_id) or check_id in checked_ids:
                raise ValueError(f"{phase_id}: duplicate or invalid check ID")
            checked_ids.add(check_id)
            if not isinstance(check.get("criterion"), str) or not check["criterion"].strip():
                raise ValueError(f"{check_id}: acceptance criterion required")
            weight = _weight(check.get("weight"), check_id)
            subtotal += weight
            status = check.get("status")
            if status not in STATES:
                raise ValueError(f"{check_id}: invalid check status")
            _evidence(check.get("evidence"), check_id, required=status == "PASS")
            if status == "PASS":
                implementers.add(_review(check, check_id))
                verified += weight
            elif check.get("review") is not None:
                raise ValueError(f"{check_id}: non-PASS checks must not carry approval")
        if not math.isclose(subtotal, phase_weight, abs_tol=0.000001):
            raise ValueError(f"{phase_id}: check weights must sum to phase weight")
        if phase["status"] == "PASS":
            if any(c["status"] != "PASS" for c in checks):
                raise ValueError(f"{phase_id}: phase PASS requires every check PASS")
            supervisor = phase.get("supervisor")
            if not isinstance(supervisor, str) or not supervisor.strip():
                raise ValueError(f"{phase_id}: phase PASS lacks independent supervisor")
            if supervisor.strip().casefold() in implementers:
                raise ValueError(f"{phase_id}: phase supervisor cannot be check implementer")
            _timestamp(phase.get("decision_at"), phase_id)
        elif phase.get("supervisor") is not None or phase.get("decision_at") is not None:
            raise ValueError(f"{phase_id}: non-PASS phase cannot claim approval")
    if not math.isclose(total, 100, abs_tol=0.000001):
        raise ValueError(f"phase weights must sum to 100, got {total}")
    return {
        "project": data["project"],
        "verified_weight": round(verified, 4),
        "total_weight": total,
        "verified_percentage": round(verified, 2),
        "check_count": len(checked_ids),
        "status": "STRUCTURE_VALID_ONLY",
    }


def main():
    print(json.dumps(validate(json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))), sort_keys=True))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, IndexError, OSError, json.JSONDecodeError) as exc:
        print(f"factory ledger invalid: {exc}", file=sys.stderr)
        sys.exit(1)
