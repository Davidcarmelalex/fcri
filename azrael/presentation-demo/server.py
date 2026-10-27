"""Presentation-only HTTP server. Controls are confined to synthetic sessions."""
from __future__ import annotations

import json
import os
import secrets
import time
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import BoundedSemaphore, Lock
from urllib.parse import urlsplit

from engine import DemoError, DemoSession

ROOT = Path(__file__).resolve().parent
COOKIE_NAME = "azrael_presentation_session"
MAX_BODY = 4096
SESSION_TTL = 7200
MAX_SESSIONS = 100
MAX_WORKERS = 32


class SessionStore:
    def __init__(self):
        self.sessions = {}
        self.lock = Lock()

    def get(self, cookie_header):
        cookie = SimpleCookie()
        try:
            cookie.load(cookie_header or "")
            token = cookie[COOKIE_NAME].value if COOKIE_NAME in cookie else None
        except Exception:
            token = None
        now = time.monotonic()
        with self.lock:
            for key, (_, touched) in list(self.sessions.items()):
                if now - touched > SESSION_TTL:
                    del self.sessions[key]
            if token in self.sessions:
                session, _ = self.sessions[token]
                self.sessions[token] = (session, now)
                return token, session, False
            if len(self.sessions) >= MAX_SESSIONS:
                oldest = min(self.sessions, key=lambda key: self.sessions[key][1])
                del self.sessions[oldest]
            token = secrets.token_urlsafe(32)
            session = DemoSession()
            self.sessions[token] = (session, now)
            return token, session, True


class DemoHandler(BaseHTTPRequestHandler):
    server_version = "AZRAEL-Presentation"
    assets = {"/": ("index.html", "text/html; charset=utf-8"), "/app.js": ("app.js", "text/javascript; charset=utf-8"), "/style.css": ("style.css", "text/css; charset=utf-8")}

    def setup(self):
        super().setup()
        self.connection.settimeout(10)

    def log_message(self, format, *args):
        # Avoid logging cookie, request body, or presenter-supplied contents.
        print(f"presentation request: {self.command} {self.path.split('?')[0]}")

    def _session(self):
        return self.server.sessions.get(self.headers.get("Cookie"))

    def _send(self, status, body, content_type="application/json; charset=utf-8", cookie=None, attachment=False):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode()
        elif isinstance(body, str):
            body = body.encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'")
        if cookie:
            secure = "; Secure" if self.headers.get("X-Forwarded-Proto") == "https" else ""
            self.send_header("Set-Cookie", f"{COOKIE_NAME}={cookie}; Path=/; HttpOnly; SameSite=Strict; Max-Age={SESSION_TTL}{secure}")
        if attachment:
            self.send_header("Content-Disposition", 'attachment; filename="azrael-demo-evidence.json"')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        pathname = urlsplit(self.path).path
        if pathname == "/healthz":
            return self._send(200, {"ok": True, "mode": "simulation"})
        if pathname in ("/api/session", "/api/export"):
            token, session, fresh = self._session()
            return self._send(200, session.snapshot(), cookie=token if fresh else None, attachment=pathname == "/api/export")
        asset = self.assets.get(pathname)
        if not asset:
            return self._send(404, {"error": "Not found"})
        try:
            return self._send(200, (ROOT / "public" / asset[0]).read_bytes(), asset[1])
        except FileNotFoundError:
            return self._send(503, {"error": "Presentation assets are not installed"})

    def _same_origin(self):
        origin = self.headers.get("Origin")
        if not origin:
            return False
        parsed = urlsplit(origin)
        expected_host = self.headers.get("Host", "")
        expected_scheme = self.headers.get("X-Forwarded-Proto", "http")
        return parsed.scheme == expected_scheme and parsed.netloc == expected_host and not parsed.path and not parsed.query and not parsed.fragment

    def do_POST(self):
        token, session, fresh = self._session()
        def error(message, status):
            snapshot = session.snapshot()
            snapshot["error"] = message
            self._send(status, snapshot, cookie=token if fresh else None)
        if not self._same_origin():
            return error("A same-origin browser request is required", 403)
        if self.headers.get("Transfer-Encoding"):
            return error("Transfer encoding is not supported", 400)
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= MAX_BODY:
                return error("Request body must be between 1 and 4096 bytes", 413)
            if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
                return error("Use application/json", 415)
            payload = json.loads(self.rfile.read(length))
            if not isinstance(payload, dict):
                return error("Expected a JSON object", 400)
        except TimeoutError:
            return error("Request body timed out", 408)
        except (ValueError, UnicodeError, json.JSONDecodeError):
            return error("Invalid JSON request", 400)
        route = urlsplit(self.path).path
        allowed_fields = {"/api/scenario": {"scenario"}, "/api/approve": {"id"}, "/api/execute": {"id"}, "/api/reject": {"id"}, "/api/reset": set()}
        if route not in allowed_fields:
            return error("Not found", 404)
        if set(payload) != allowed_fields[route] or any(not isinstance(value, str) for value in payload.values()):
            return error("Only the documented scenario or incident identifier is accepted", 400)
        try:
            if route == "/api/scenario":
                result = session.create_incident(payload["scenario"])
            elif route == "/api/reset":
                result = session.reset()
            else:
                operation = {"/api/approve": session.approve, "/api/execute": session.execute, "/api/reject": session.reject}[route]
                result = operation(payload["id"])
            self._send(200, result, cookie=token if fresh else None)
        except DemoError as exc:
            error(str(exc), exc.status)


class BoundedDemoServer(ThreadingHTTPServer):
    """Reject excess connections instead of creating unbounded worker threads."""
    daemon_threads = True
    request_queue_size = 32

    def __init__(self, address, handler, *, max_workers=MAX_WORKERS):
        self._worker_slots = BoundedSemaphore(max_workers)
        super().__init__(address, handler)

    def process_request(self, request, client_address):
        if not self._worker_slots.acquire(blocking=False):
            try:
                request.settimeout(2)
                request.sendall(b"HTTP/1.0 503 Service Unavailable\r\nContent-Type: application/json\r\nContent-Length: 28\r\nConnection: close\r\nRetry-After: 2\r\n\r\n{\"error\":\"Demo server busy\"}")
            except OSError:
                pass
            finally:
                self.shutdown_request(request)
            return
        try:
            super().process_request(request, client_address)
        except BaseException:
            self._worker_slots.release()
            raise

    def process_request_thread(self, request, client_address):
        try:
            super().process_request_thread(request, client_address)
        finally:
            self._worker_slots.release()


def create_server(host="127.0.0.1", port=3089, *, max_workers=MAX_WORKERS):
    server = BoundedDemoServer((host, port), DemoHandler, max_workers=max_workers)
    server.sessions = SessionStore()
    server.daemon_threads = True
    return server


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "3089"))
    server = create_server(host, port)
    print(f"AZRAEL synthetic presentation demo: http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
