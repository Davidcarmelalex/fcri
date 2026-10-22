"""Local HTTP boundary. Place behind TLS + a managed proxy for shared pilots."""
import json
import time
import threading
from collections import OrderedDict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from .core import Problem, require


class Server(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address, store):
        super().__init__(address, Handler)
        self.store = store
        self.buckets = OrderedDict()
        self.bucket_lock = threading.Lock()

    def rate_limit(self, address):
        now = time.monotonic()
        with self.bucket_lock:
            start, count = self.buckets.pop(address, (now, 0))
            if now-start > 60:
                start, count = now, 0
            self.buckets[address] = (start, count+1)
            if len(self.buckets) > 4096:
                self.buckets.popitem(last=False)
            require(count < 120, 429, "Too many requests; retry after one minute")


class Handler(BaseHTTPRequestHandler):
    server_version = "AIBI"

    def setup(self):
        super().setup()
        self.connection.settimeout(10)

    def log_message(self, *args):
        pass  # Never log query strings, credentials, request bodies or user data.

    def reply(self, status, body, content_type="application/json; charset=utf-8"):
        raw = body if isinstance(body, bytes) else json.dumps(body, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        self.dispatch("GET")

    def do_POST(self):
        self.dispatch("POST")

    def dispatch(self, method):
        try:
            self.server.rate_limit(self.client_address[0])
            path = urlsplit(self.path).path
            # Explicit static allowlist avoids filesystem path traversal.
            assets = {"/": ("index.html", "text/html; charset=utf-8"), "/app.js": ("app.js", "text/javascript; charset=utf-8"), "/style.css": ("style.css", "text/css; charset=utf-8")}
            if method == "GET" and path in assets:
                name, mime = assets[path]
                return self.reply(200, (Path(__file__).parent / "web" / name).read_bytes(), mime)
            if method == "GET" and path == "/health":
                return self.reply(200, {"status": "ok", "adapter": "mock", "agent": "Agent47-scoped"})
            require(path.startswith("/api/"), 404, "Not found")
            require(not self.headers.get("Transfer-Encoding"), 400, "Transfer encoding unsupported")
            body = {}
            if method == "POST":
                require(self.headers.get_content_type() == "application/json", 415, "JSON required")
                length = int(self.headers.get("Content-Length", "0"))
                require(0 < length <= 20000, 413, "Invalid body size")
                body = json.loads(self.rfile.read(length))
                require(isinstance(body, dict), 400, "JSON object required")
            authorization = self.headers.get("Authorization", "")
            require(authorization.startswith("Bearer "), 401, "Bearer credential required")
            store = self.server.store
            with store.connection() as c:
                p = store.authenticate(c, authorization[7:])
                result = self.route(c, p, method, path, body)
            if isinstance(result, dict) and "_status" in result:
                self.reply(result["_status"], {"error": result["_error"]})
            else:
                self.reply(200, result)
        except Problem as e:
            self.reply(e.status, {"error": str(e)})
        except (ValueError, UnicodeDecodeError, KeyError, TypeError):
            self.reply(400, {"error": "Invalid request"})
        except Exception:
            self.reply(500, {"error": "Internal error"})

    def route(self, c, p, method, path, body):
        store = self.server.store
        c.execute("SAVEPOINT request")
        try:
            result = self.handle_route(c, p, method, path, body)
            c.execute("RELEASE request")
            return result
        except Problem as e:
            c.execute("ROLLBACK TO request")
            c.execute("RELEASE request")
            store.audit(c, p, "request.denied")
            # Return error after commit, preserving the denial metadata.
            return {"_error": str(e), "_status": e.status}

    def handle_route(self, c, p, method, path, body):
        store = self.server.store
        if method == "GET" and path == "/api/me":
            return {"user": p.user, "tenant": p.tenant, "role": p.role, "adapter": "mock"}
        if method == "GET" and path == "/api/briefing":
            return store.briefing(c, p)
        if method == "GET" and path.startswith("/api/records/"):
            return store.read(c, p, path.removeprefix("/api/records/"))
        if method == "GET" and path == "/api/actions":
            return store.visible_actions(c, p)
        if method == "GET" and path == "/api/audit":
            require(p.role in {"admin", "executive"})
            store.audit(c, p, "audit.read")
            days = c.execute("SELECT audit_days FROM tenants WHERE id=?", (p.tenant,)).fetchone()[0]
            return [dict(r) for r in c.execute("SELECT sequence,actor,event,object_id,created FROM audit WHERE tenant=? AND created>? ORDER BY sequence DESC LIMIT 200", (p.tenant, time.time()-days*86400))]
        if method == "POST" and path == "/api/assistant":
            require(set(body) <= {"message", "language"}, 400, "Invalid assistant fields")
            text = body.get("message", "")
            require(isinstance(text, str) and 0 < len(text) <= 2000, 400, "Message required")
            language = body.get("language", "en")
            # Grounded bilingual read-only assistant. No claim of LLM inference.
            result = store.briefing(c, p, language)
            topics = {"calendar": ("calendar", "കലണ്ടർ"), "tasks": ("task", "ചുമതല"), "meetings": ("meeting", "യോഗ"), "enrollments": ("enrollment", "പ്രവേശനം"), "sales": ("sales", "വിൽപ്പന"), "staffing": ("staff", "ജീവനക്കാർ"), "expenses": ("expense", "ചെലവ്")}
            selected = [kind for kind, words in topics.items() if any(word in text.lower() for word in words)]
            if selected:
                require(all(kind in result["sections"] for kind in selected))
                result["sections"] = {k: result["sections"][k] for k in selected}
                result["counts"] = {k: result["counts"][k] for k in selected}
            result["engine"] = "bilingual deterministic briefing"
            result["answer"] = "Here is your current authorized campus briefing. Use the action form to draft changes for review." if language == "en" else "നിങ്ങൾക്ക് അനുമതിയുള്ള ക്യാമ്പസ് റിപ്പോർട്ട് താഴെ കാണാം. മാറ്റങ്ങൾ നിർദ്ദേശിക്കാൻ പ്രവർത്തന ഫോം ഉപയോഗിക്കുക."
            return result
        if method == "POST" and path == "/api/actions":
            require(set(body) == {"operation", "data"}, 400, "Operation and data required")
            return store.propose(c, p, body["operation"], body["data"], self.headers.get("Idempotency-Key"))
        parts = path.strip("/").split("/")
        if method == "POST" and len(parts) == 4 and parts[:2] == ["api", "actions"]:
            aid, verb = parts[2:]
            if verb in {"approve", "reject"}:
                require(set(body) == {"digest"}, 400, "Review digest required")
                return store.decide(c, p, aid, body["digest"], verb == "approve")
            if verb == "execute":
                require(not body, 400, "Execution accepts no replacement payload")
                return store.execute(c, p, aid)
        raise Problem(404, "Not found")
