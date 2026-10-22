"""Constrained model-backed agent with a deliberately small tool surface."""
import ast
import json
import operator
import math
import os
import sqlite3
import threading
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

import httpx

DB_PATH = Path(os.getenv("AGENT47_DB_PATH", "/tmp/agent47.db"))
_LOCK = threading.Lock()
OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv}


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as db:
        db.execute("CREATE TABLE IF NOT EXISTS messages (session TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, created TEXT NOT NULL)")


def remember(session, role, content):
    with _LOCK, sqlite3.connect(DB_PATH) as db:
        db.execute("INSERT INTO messages VALUES (?,?,?,?)", (session, role, content, datetime.now(timezone.utc).isoformat()))


def history(session):
    with sqlite3.connect(DB_PATH) as db:
        return [{"role": r, "content": c} for r, c in db.execute("SELECT role,content FROM messages WHERE session=? ORDER BY rowid DESC LIMIT 20", (session,))][::-1]


def calculate(expr):
    if not isinstance(expr, str) or len(expr) > 120:
        raise ValueError("Expression too long")
    def evaluate(node, depth=0):
        if depth > 12:
            raise ValueError("Expression too complex")
        if isinstance(node, ast.Expression):
            return evaluate(node.body, depth + 1)
        if isinstance(node, ast.Constant) and type(node.value) in (int, float):
            if not math.isfinite(node.value) or abs(node.value) > 1e12:
                raise ValueError("Number too large")
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in OPS:
            a, b = evaluate(node.left, depth + 1), evaluate(node.right, depth + 1)
            result = OPS[type(node.op)](a, b)
            if not math.isfinite(result) or abs(result) > 1e15:
                raise ValueError("Result too large")
            return result
        raise ValueError("Unsupported expression")
    return evaluate(ast.parse(expr, mode="eval"))


TOOLS = [{"type":"function","function":{"name":"calculate","description":"Evaluate a simple arithmetic expression","parameters":{"type":"object","properties":{"expression":{"type":"string"}},"required":["expression"],"additionalProperties":False}}}]


def run_agent(prompt, session=None):
    if not isinstance(prompt, str) or not prompt.strip() or len(prompt) > 8000:
        raise ValueError("Prompt must contain 1-8000 characters")
    token = os.getenv("AGENT47_MODEL_API_KEY", "")
    base = os.getenv("AGENT47_MODEL_BASE_URL", "").rstrip("/")
    model = os.getenv("AGENT47_MODEL", "")
    if not token or not base or not model:
        raise RuntimeError("Model provider not configured")
    parsed = urlsplit(base)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.fragment or parsed.query:
        raise RuntimeError("Model endpoint must be a valid HTTPS base URL")
    session = session or uuid.uuid4().hex
    if len(session) > 100 or not all(c.isalnum() or c in "-_" for c in session):
        raise ValueError("Invalid session")
    init_db()
    messages = [{"role":"system","content":"You are AGENT 47, a helpful FCRI/AIBI research assistant. Do not claim external actions you cannot perform. The only available tool is arithmetic calculation."}] + history(session)
    messages.append({"role":"user","content":prompt})
    url = base + "/chat/completions"
    with httpx.Client(timeout=45, follow_redirects=False, trust_env=False) as client:
        for _ in range(4):
            resp = client.post(url, headers={"Authorization":"Bearer "+token}, json={"model":model,"messages":messages,"tools":TOOLS,"tool_choice":"auto","max_tokens":1500})
            resp.raise_for_status()
            try:
                choice = resp.json()["choices"][0]["message"]
                if not isinstance(choice, dict):
                    raise TypeError("Invalid message")
            except (KeyError, IndexError, TypeError, ValueError) as exc:
                raise RuntimeError("Invalid model provider response") from exc
            calls = choice.get("tool_calls") or []
            if not calls:
                answer = choice.get("content") or ""
                if not isinstance(answer, str):
                    raise RuntimeError("Invalid assistant response content")
                remember(session, "user", prompt)
                remember(session, "assistant", answer)
                return {"session":session,"answer":answer}
            messages.append(choice)
            if len(calls) > 3:
                raise RuntimeError('Model exceeded per-round tool-call limit')
            for call in calls:
                fn = call.get("function", {})
                try:
                    if fn.get("name") != "calculate":
                        raise ValueError("Unknown tool")
                    args = json.loads(fn.get("arguments", "{}"))
                    result = str(calculate(args["expression"]))
                except (ValueError, KeyError, TypeError, ZeroDivisionError, SyntaxError, OverflowError) as exc:
                    result = "Tool error: " + str(exc)
                if not isinstance(call.get("id"), str):
                    raise RuntimeError("Provider returned invalid tool-call identifier")
                messages.append({"role":"tool","tool_call_id":call["id"],"content":result})
    raise RuntimeError("Agent exceeded tool-call limit")
