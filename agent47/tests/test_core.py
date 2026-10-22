import unittest
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from core.policy import Principal, authorize
from core.registry import load_registry
from core.executor import SkillExecutor

class TestSkillSecurity(unittest.TestCase):
    def setUp(self):
        self.principal = Principal(1001, "aibi", "director", frozenset({"executive.daily_briefing"}))
        self.skill = {"id": "executive.daily_briefing", "status": "implemented", "default_access": "deny", "external_side_effects_allowed": False}

    def test_registry_contains_192_denied_skills(self):
        skills = load_registry()
        self.assertEqual(len(skills), 192)
        self.assertTrue(all(x["default_access"] == "deny" for x in skills.values()))

    def test_granted_read_only_skill(self):
        self.assertTrue(authorize(self.principal, self.skill, "aibi").allowed)

    def test_wrong_tenant_denied(self):
        self.assertFalse(authorize(self.principal, self.skill, "another").allowed)

    def test_unimplemented_denied(self):
        self.assertFalse(authorize(self.principal, {**self.skill, "status": "specification_only"}, "aibi").allowed)

    def test_ungranted_denied(self):
        self.assertFalse(authorize(self.principal, {**self.skill, "id": "finance.budget_review"}, "aibi").allowed)

    def test_external_side_effects_denied(self):
        self.assertFalse(authorize(self.principal, {**self.skill, "external_side_effects_allowed": True}, "aibi").allowed)

    def test_unknown_identity_denied(self):
        self.assertFalse(authorize(None, self.skill, "aibi").allowed)

    def test_executor_missing_adapter_denied(self):
        result = SkillExecutor({"executive.daily_briefing": self.skill}, {}).execute(self.principal, "aibi", "executive.daily_briefing")
        self.assertEqual(result.status, "unavailable")

if __name__ == "__main__":
    unittest.main()
