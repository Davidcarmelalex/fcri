"""Regression tests for the portable, evidence-weighted factory gate schema."""
import copy
import importlib.util
import json
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("verify_factory", HERE / "verify_factory.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
ROOT = HERE.parents[3]
LEDGER = json.loads((ROOT / "engineering-factory/adapters/azrael-gates.json").read_text())
SHA = "a" * 40


def approved_check(check, reviewer="qa-independent", implementer="builder"):
    check["status"] = "PASS"
    check["evidence"] = [{
        "source_sha": SHA,
        "command": "python -m unittest",
        "environment": "isolated synthetic fixture",
        "timestamp": "2026-11-02T00:00:00Z",
        "outcome": "PASS",
        "reference": "https://example.invalid/verification/1",
    }]
    check["review"] = {
        "reviewer": reviewer, "implementer": implementer,
        "decision_at": "2026-11-02T01:00:00Z", "verdict": "PASS",
    }




def approved_phase(value, index):
    phase = value["phases"][index]
    for check in phase["checks"]:
        approved_check(check)
    phase.update(status="PASS", supervisor="qa-independent", decision_at="2026-11-02T02:00:00Z")


class FactoryLedgerTests(unittest.TestCase):
    def test_azrael_structure(self):
        result = mod.validate(LEDGER)
        self.assertEqual(result["verified_percentage"], 0)
        self.assertEqual(result["check_count"], 22)
        self.assertEqual(result["status"], "STRUCTURE_VALID_ONLY")

    def test_partial_check_progress_without_phase_approval(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        result = mod.validate(value)
        self.assertEqual(result["verified_percentage"], 3.33)
        self.assertEqual(value["phases"][0]["status"], "BLOCKED")

    def test_phase_pass_requires_all_checks(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        value["phases"][0].update(status="PASS", supervisor="qa-independent", decision_at="2026-11-02T01:00:00Z")
        with self.assertRaisesRegex(ValueError, "every check PASS"):
            mod.validate(value)

    def test_full_phase_pass_with_independent_supervisor(self):
        value = copy.deepcopy(LEDGER)
        for check in value["phases"][0]["checks"]:
            approved_check(check)
        value["phases"][0].update(status="PASS", supervisor="qa-independent", decision_at="2026-11-02T02:00:00Z")
        self.assertEqual(mod.validate(value)["verified_percentage"], 10)

    def test_self_review_rejected(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0], reviewer="BUILDER", implementer="builder")
        with self.assertRaisesRegex(ValueError, "self-review"):
            mod.validate(value)

    def test_self_supervision_rejected(self):
        value = copy.deepcopy(LEDGER)
        for check in value["phases"][0]["checks"]:
            approved_check(check)
        value["phases"][0].update(status="PASS", supervisor="builder", decision_at="2026-11-02T02:00:00Z")
        with self.assertRaisesRegex(ValueError, "supervisor cannot"):
            mod.validate(value)

    def test_missing_review_rejected(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        value["phases"][0]["checks"][0]["review"] = None
        with self.assertRaisesRegex(ValueError, "independent review"):
            mod.validate(value)

    def test_invalid_evidence_sha_rejected(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        value["phases"][0]["checks"][0]["evidence"][0]["source_sha"] = "short"
        with self.assertRaisesRegex(ValueError, "source_sha"):
            mod.validate(value)

    def test_failed_evidence_cannot_pass(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        value["phases"][0]["checks"][0]["evidence"][0]["outcome"] = "FAIL"
        with self.assertRaisesRegex(ValueError, "passing evidence"):
            mod.validate(value)

    def test_review_cannot_predate_evidence(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        value["phases"][0]["checks"][0]["review"]["decision_at"] = "2026-11-01T23:00:00Z"
        with self.assertRaisesRegex(ValueError, "predates evidence"):
            mod.validate(value)

    def test_phase_approval_cannot_predate_check_review(self):
        value = copy.deepcopy(LEDGER)
        for check in value["phases"][0]["checks"]:
            approved_check(check)
        value["phases"][0].update(status="PASS", supervisor="qa-independent", decision_at="2026-11-02T00:30:00Z")
        with self.assertRaisesRegex(ValueError, "predates check review"):
            mod.validate(value)

    def test_pass_evidence_must_share_one_revision(self):
        value = copy.deepcopy(LEDGER)
        check = value["phases"][0]["checks"][0]
        approved_check(check)
        another = copy.deepcopy(check["evidence"][0])
        another["source_sha"] = "b" * 40
        check["evidence"].append(another)
        with self.assertRaisesRegex(ValueError, "one source revision"):
            mod.validate(value)

    def test_pass_evidence_same_revision_case_insensitive(self):
        value = copy.deepcopy(LEDGER)
        check = value["phases"][0]["checks"][0]
        approved_check(check)
        another = copy.deepcopy(check["evidence"][0])
        another["source_sha"] = SHA.upper()
        check["evidence"].append(another)
        self.assertGreater(mod.validate(value)["verified_percentage"], 0)

    def test_bad_review_date_rejected(self):
        value = copy.deepcopy(LEDGER)
        approved_check(value["phases"][0]["checks"][0])
        value["phases"][0]["checks"][0]["review"]["decision_at"] = "yesterday"
        with self.assertRaisesRegex(ValueError, "timestamp"):
            mod.validate(value)

    def test_bad_phase_weights_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][0]["weight"] = 100
        with self.assertRaisesRegex(ValueError, "check weights"):
            mod.validate(value)

    def test_bad_check_weights_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][0]["checks"][0]["weight"] = float("nan")
        with self.assertRaisesRegex(ValueError, "finite positive"):
            mod.validate(value)

    def test_duplicate_check_ids_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][0]["checks"][1]["id"] = "M0-C1"
        with self.assertRaisesRegex(ValueError, "duplicate"):
            mod.validate(value)

    def test_malformed_phase_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][2] = "not a gate"
        with self.assertRaisesRegex(ValueError, "M0..M8"):
            mod.validate(value)

    def test_phase_pass_rejects_blocked_prerequisite(self):
        value = copy.deepcopy(LEDGER)
        approved_phase(value, 1)
        with self.assertRaisesRegex(ValueError, "prerequisite phases not PASS: M0"):
            mod.validate(value)

    def test_parallel_sibling_gate_can_pass_after_foundation(self):
        value = copy.deepcopy(LEDGER)
        approved_phase(value, 0)
        approved_phase(value, 1)
        approved_phase(value, 3)
        result = mod.validate(value)
        self.assertEqual(result["verified_percentage"], 35)
        self.assertEqual(value["phases"][2]["status"], "BLOCKED")

    def test_staging_requires_all_declared_prior_gates(self):
        value = copy.deepcopy(LEDGER)
        approved_phase(value, 0)
        approved_phase(value, 1)
        approved_phase(value, 7)
        with self.assertRaisesRegex(ValueError, "prerequisite phases not PASS: M2"):
            mod.validate(value)

    def test_forward_dependency_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][1]["depends_on"] = ["M7"]
        with self.assertRaisesRegex(ValueError, "earlier known phases"):
            mod.validate(value)

    def test_duplicate_dependency_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][1]["depends_on"] = ["M0", "M0"]
        with self.assertRaisesRegex(ValueError, "duplicate prerequisites"):
            mod.validate(value)

    def test_missing_dependency_declaration_rejected(self):
        value = copy.deepcopy(LEDGER)
        del value["phases"][1]["depends_on"]
        with self.assertRaisesRegex(ValueError, "depends_on"):
            mod.validate(value)

    def test_old_schema_fails_closed(self):
        value = copy.deepcopy(LEDGER)
        value["schema_version"] = 1
        with self.assertRaisesRegex(ValueError, "expected v2"):
            mod.validate(value)


if __name__ == "__main__":
    unittest.main()
