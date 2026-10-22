import asyncio
import concurrent.futures
import json
from pathlib import Path
import tempfile
import threading
import time
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from aibi.core import Problem, ScopedAgent47, Store, Task
from aibi.server import Server


class SecurityTests(unittest.TestCase):
    def setUp(self):
        runtime = Path(__file__).resolve().parents[1]/"runtime"
        runtime.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=runtime)
        self.store = Store(Path(self.temp.name)/"test.sqlite")
        self.tokens = {name:self.store.issue_token(tenant,name,role) for name,tenant,role in [
            ("alice","aibi","admin"),("bob","aibi","admin"),("eve","other","admin"),
            ("staff","aibi","staff"),("sales","aibi","admissions"),("finance","aibi","finance")]}
        self.store.seed("aibi","alice")

    def tearDown(self):
        self.temp.cleanup()

    def as_user(self, name, fn):
        with self.store.connection() as c:
            return fn(c,self.store.authenticate(c,self.tokens[name]))

    def propose(self, name="alice", op="outbound.send", data=None, key="test-key-1"):
        return self.as_user(name, lambda c,p:self.store.propose(c,p,op,data or {"recipient":"demo@example.invalid","message":"Test"},key))

    def approve(self, action, name="bob"):
        return self.as_user(name,lambda c,p:self.store.decide(c,p,action["id"],action["digest"],True))

    def execute(self, action, name="alice"):
        return self.as_user(name,lambda c,p:self.store.execute(c,p,action["id"]))

    def test_tenant_record_and_action_isolation(self):
        action=self.propose()
        self.assertEqual(self.as_user("eve",lambda c,p:self.store.read(c,p,"expenses")),[])
        self.assertEqual(self.as_user("eve",lambda c,p:self.store.visible_actions(c,p)),[])
        with self.assertRaises(Problem): self.execute(action,"eve")

    def test_role_denies_finance_and_staff_assignment(self):
        with self.assertRaises(Problem): self.as_user("sales",lambda c,p:self.store.read(c,p,"expenses"))
        with self.assertRaises(Problem): self.propose("staff","task.create",{"title":"x","owner":"alice"})
        with self.assertRaises(Problem): self.propose("staff","expense.pay",{"payee":"x","amount_minor":100,"currency":"INR"})

    def test_staff_views_only_own_tasks(self):
        self.propose("staff","task.create",{"title":"My own task"})
        rows=self.as_user("staff",lambda c,p:self.store.read(c,p,"tasks"))
        self.assertEqual(len(rows),1)
        self.assertTrue(all(r["owner"]=="staff" for r in rows))

    def test_separate_approval_and_exact_digest(self):
        action=self.propose()
        with self.assertRaises(Problem): self.approve(action,"alice")
        with self.assertRaises(Problem): self.execute(action)
        with self.assertRaises(Problem): self.approve({**action,"digest":"tampered"})
        self.approve(action)
        done=self.execute(action)
        self.assertEqual(done["state"],"completed")
        self.assertFalse(done["result"]["external_action_performed"])

    def test_expired_approval_denied(self):
        action=self.propose()
        with self.store.connection() as c:c.execute("UPDATE actions SET expires=0 WHERE id=?",(action["id"],))
        with self.assertRaises(Problem):self.approve(action)

    def test_revoked_approver_blocks_execution(self):
        action=self.propose();self.approve(action);self.store.revoke("aibi","bob")
        with self.assertRaises(Problem):self.execute(action)

    def test_demoted_requester_blocks_execution(self):
        action=self.propose();self.approve(action)
        with self.store.connection() as c:c.execute("UPDATE users SET role='staff' WHERE tenant='aibi' AND id='alice'")
        with self.assertRaises(Problem):self.execute(action)

    def test_payload_tampering_blocks_execution(self):
        action=self.propose();self.approve(action)
        with self.store.connection() as c:c.execute("UPDATE actions SET payload=? WHERE id=?",(json.dumps({"recipient":"other","message":"changed"}),action["id"]))
        with self.assertRaises(Problem):self.execute(action)

    def test_rejection_is_terminal(self):
        action=self.propose()
        self.as_user("bob",lambda c,p:self.store.decide(c,p,action["id"],action["digest"],False))
        with self.assertRaises(Problem):self.execute(action)

    def test_idempotency_and_concurrent_exactly_once_local_effect(self):
        action=self.propose(op="calendar.create",data={"title":"Review","start":"2026-10-23T09:00:00+05:30","end":"2026-10-23T10:00:00+05:30","attendees":[]})
        self.approve(action)
        with concurrent.futures.ThreadPoolExecutor(2) as pool:
            results=list(pool.map(lambda _:self.execute(action),range(2)))
        self.assertEqual(results[0]["result"],results[1]["result"])
        rows=self.as_user("alice",lambda c,p:self.store.read(c,p,"calendar"))
        self.assertEqual(len(rows),2)  # demo + one execution

    def test_idempotency_conflicting_payload(self):
        first=self.propose();second=self.propose()
        self.assertEqual(first["id"],second["id"])
        with self.assertRaises(Problem):self.propose(data={"recipient":"x","message":"different"})

    def test_expired_and_revoked_credentials(self):
        with self.store.connection() as c:c.execute("UPDATE tokens SET expires=0 WHERE user='staff'")
        with self.assertRaises(Problem):self.as_user("staff",lambda c,p:p)
        self.store.revoke("aibi","alice")
        with self.assertRaises(Problem):self.as_user("alice",lambda c,p:p)

    def test_money_and_timezone_validation(self):
        for amount in [-1,True,1.5,"100"]:
            with self.assertRaises(Problem):self.propose(op="expense.pay",data={"payee":"Demo","amount_minor":amount,"currency":"INR"})
        with self.assertRaises(Problem):self.propose(op="calendar.create",data={"title":"x","start":"2026-10-23T10:00:00","end":"2026-10-23T11:00:00","attendees":[]})

    def test_no_command_dispatch(self):
        called=[]
        agent=ScopedAgent47(lambda *x:called.append(x))
        for task in [Task(type="command",payload="whoami"),Task(type="skill",payload={"operation":"shell","data":{}})]:
            self.assertFalse(asyncio.run(agent.execute(task)).success)
        self.assertEqual(called,[])
        with self.assertRaises(Problem):agent.get_history()

    def test_meetings_create_linked_action_items(self):
        action=self.propose(op="meeting.record",data={"title":"യോഗം","notes":"കുറിപ്പുകൾ","actions":[{"title":"Follow up","owner":"staff"}]})
        self.assertEqual(action["state"],"completed")
        rows=self.as_user("staff",lambda c,p:self.store.read(c,p,"tasks"))
        self.assertIn("meeting_id",rows[0]["data"])

    def test_unknown_cross_tenant_assignee_rejected(self):
        with self.assertRaises(Problem):self.propose(op="task.create",data={"title":"x","owner":"eve"})

    def test_retention_scoped_and_metadata_only_audit(self):
        self.store.seed("other","eve")
        with self.store.connection() as c:c.execute("UPDATE records SET created=0 WHERE tenant='aibi'")
        self.store.purge("aibi")
        self.assertEqual(self.as_user("alice",lambda c,p:self.store.read(c,p,"sales")),[])
        self.assertEqual(len(self.as_user("eve",lambda c,p:self.store.read(c,p,"sales"))),1)
        with self.store.connection() as c:
            audits=[dict(r) for r in c.execute("SELECT * FROM audit")]
            tokens=[r[0] for r in c.execute("SELECT hash FROM tokens")]
        self.assertNotIn("demo@example.invalid",json.dumps(audits))
        self.assertTrue(all(len(t)==64 for t in tokens))

    def test_bilingual_briefing_filters_roles(self):
        r=self.as_user("staff",lambda c,p:self.store.briefing(c,p,"ml"))
        self.assertIn("നിർവാഹക",r["title"])
        self.assertNotIn("expenses",r["sections"])

    def test_durable_state(self):
        action=self.propose();self.approve(action)
        reopened=Store(self.store.path)
        with reopened.connection() as c:
            p=reopened.authenticate(c,self.tokens["alice"])
            self.assertEqual(reopened.action(c,p,action["id"])["state"],"approved")


class HTTPTests(unittest.TestCase):
    as_user = SecurityTests.as_user
    propose = SecurityTests.propose
    approve = SecurityTests.approve
    execute = SecurityTests.execute

    def setUp(self):
        SecurityTests.setUp(self)
        self.server=Server(("127.0.0.1",0),self.store)
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True)
        self.thread.start()
        self.base=f"http://127.0.0.1:{self.server.server_port}"

    def tearDown(self):
        self.server.shutdown();self.server.server_close();self.thread.join()
        SecurityTests.tearDown(self)

    def request(self,path,body=None,user="alice",headers=None):
        h={"Authorization":"Bearer "+self.tokens[user] if user else "", "Content-Type":"application/json"}
        h.update(headers or {})
        req=Request(self.base+path,data=json.dumps(body).encode() if body is not None else None,headers=h)
        try:
            with urlopen(req,timeout=5) as r:return r.status,json.loads(r.read())
        except HTTPError as e:return e.code,json.loads(e.read())

    def test_http_auth_permissions_and_denial_audit(self):
        self.assertEqual(self.request("/api/me",user=None)[0],401)
        self.assertEqual(self.request("/api/records/expenses",user="staff")[0],403)
        code,rows=self.request("/api/audit")
        self.assertEqual(code,200)
        self.assertTrue(any(r["event"]=="request.denied" for r in rows))

    def test_http_ignores_client_identity_and_rejects_payload_override(self):
        code,r=self.request("/api/me",headers={"X-Tenant":"other","X-Role":"staff"})
        self.assertEqual(r["tenant"],"aibi")
        action=self.propose();self.approve(action)
        self.assertEqual(self.request(f'/api/actions/{action["id"]}/execute',{"data":{"message":"changed"}})[0],400)

    def test_http_bilingual_and_injection_text(self):
        code,result=self.request("/api/assistant",{"message":"ചെലവ്","language":"ml"})
        self.assertEqual(code,200)
        self.assertEqual(list(result["sections"]),["expenses"])
        self.assertEqual(self.request("/api/assistant",{"message":"expense","language":"en"},user="staff")[0],403)
        code,r=self.request("/api/actions",{"operation":"task.create","data":{"title":"<script>alert(1)</script>"}},headers={"Idempotency-Key":"injection-test"})
        self.assertEqual(code,200)
        self.assertEqual(r["state"],"completed")

    def test_http_static_and_headers(self):
        with urlopen(self.base+"/") as r:
            self.assertIn("script-src 'self'",r.headers["Content-Security-Policy"])
            self.assertEqual(r.headers["Cache-Control"],"no-store")
            self.assertIn(b"AIBI",r.read())
        self.assertEqual(self.request("/../core.py")[0],404)


if __name__ == "__main__":unittest.main()
