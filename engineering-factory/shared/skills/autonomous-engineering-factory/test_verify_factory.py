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

class FactoryLedgerTests(unittest.TestCase):
    def test_azrael_structure(self):
        result = mod.validate(LEDGER)
        self.assertEqual(result["verified_percentage"], 0)
        self.assertEqual(result["status"], "STRUCTURE_VALID_ONLY")

    def test_missing_supervisor_cannot_pass(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][0]["status"] = "PASS"
        value["phases"][0]["evidence"] = ["sha:abc"]
        with self.assertRaisesRegex(ValueError, "independent decision"):
            mod.validate(value)

    def test_bad_weights_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][0]["weight"] = 100
        with self.assertRaisesRegex(ValueError, "sum to 100"):
            mod.validate(value)

    def test_malformed_phase_rejected(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][2] = "not a gate"
        with self.assertRaisesRegex(ValueError, "M0..M8"):
            mod.validate(value)

    def test_nonempty_evidence_required(self):
        value = copy.deepcopy(LEDGER)
        value["phases"][0].update(status="PASS", supervisor="independent reviewer", decision_at="2026-11-02")
        with self.assertRaisesRegex(ValueError, "independent decision"):
            mod.validate(value)

if __name__ == "__main__":
    unittest.main()
