import json, sqlite3, tempfile, unittest
from pathlib import Path
from src.orchestrator import ROLES, submit, list_tasks, connect

class TestCore(unittest.TestCase):
    def test_role_count(self):
        self.assertEqual(len(ROLES),69)
    def test_unknown_role_rejected(self):
        with self.assertRaises(ValueError): submit("fake","test")
    def test_task_requires_review(self):
        with tempfile.TemporaryDirectory() as d:
            db=connect(Path(d)/"test.db")
            task=submit("scholar","Create curriculum",db)
            row=list_tasks(db)[0]
            self.assertEqual(row["id"],task)
            self.assertEqual(row["status"],"pending_review")
            self.assertEqual(row["approval"],"required")
            db.close()
if __name__=="__main__": unittest.main()
