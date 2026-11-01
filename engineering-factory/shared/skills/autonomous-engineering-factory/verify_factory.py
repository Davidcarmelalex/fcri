#!/usr/bin/env python3
"""Portable schema checker. Structural checks do not independently approve evidence."""
import json
import sys
from pathlib import Path

IDS = tuple(f"M{i}" for i in range(9))
STATES = {"PASS", "FAIL", "BLOCKED"}

def validate(data):
    if not isinstance(data, dict) or data.get("schema_version") != 1:
        raise ValueError("unsupported ledger schema")
    if not data.get("project") or not data.get("canonical_repository"):
        raise ValueError("project and repository required")
    phases = data.get("phases")
    if not isinstance(phases, list) or len(phases) != len(IDS) or any(not isinstance(p, dict) for p in phases) or [p.get("id") for p in phases] != list(IDS):
        raise ValueError("M0..M8 required in order")
    total = 0
    passed = 0
    for p in phases:
        w = p.get("weight")
        if isinstance(w, bool) or not isinstance(w, (int, float)) or w < 0:
            raise ValueError("weights must be nonnegative numbers")
        total += w
        if p.get("status") not in STATES:
            raise ValueError(f"invalid gate status: {p['id']}")
        evidence = p.get("evidence")
        if not isinstance(evidence, list) or any(not isinstance(x, str) or not x.strip() for x in evidence):
            raise ValueError(f"invalid evidence: {p['id']}")
        if p["status"] == "PASS":
            if not evidence or not p.get("supervisor") or not p.get("decision_at"):
                raise ValueError(f"PASS lacks independent decision/evidence: {p['id']}")
            passed += w
    if abs(total - 100) > 0.000001:
        raise ValueError(f"weights must sum to 100, got {total}")
    return {"project": data["project"], "verified_weight": passed, "total_weight": total, "verified_percentage": round(100 * passed / total, 2), "status": "STRUCTURE_VALID_ONLY"}

def main():
    path = Path(sys.argv[1])
    print(json.dumps(validate(json.loads(path.read_text(encoding="utf-8"))), sort_keys=True))

if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, IndexError, OSError, json.JSONDecodeError) as e:
        print(f"factory ledger invalid: {e}", file=sys.stderr)
        sys.exit(1)
