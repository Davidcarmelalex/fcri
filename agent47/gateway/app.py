"""AGENT47 read-only research gateway. OSIRIS is disabled unless explicitly configured."""
import ipaddress
import os
import secrets
import socket
import time
from collections import defaultdict, deque
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AGENT47 Research Gateway", version="0.1.0", docs_url=None, redoc_url=None)
allowed_origins = [v.strip() for v in os.getenv("AGENT47_ALLOWED_ORIGINS", "").split(",") if v.strip()]
if allowed_origins:
    app.add_middleware(CORSMiddleware, allow_origins=allowed_origins, allow_methods=["GET"], allow_headers=["Authorization"])
USGS = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
PERIODS = {"day": "all_day", "week": "all_week", "month": "all_month"}
_cache = {}
_hits = defaultdict(deque)

def throttle(request: Request):
    # This is per-process protection, not distributed DDoS mitigation.
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    q = _hits[ip]
    while q and now - q[0] > 60:
        q.popleft()
    if len(q) >= 45:
        raise HTTPException(429, "Request limit exceeded")
    q.append(now)

def authenticate(authorization: str | None):
    expected = os.getenv("AGENT47_GATEWAY_TOKEN", "")
    if len(expected) < 32:
        raise HTTPException(503, "Private API not configured")
    supplied = (authorization or "").removeprefix("Bearer ").strip()
    if not secrets.compare_digest(supplied, expected):
        raise HTTPException(401, "Unauthorized")

def osiris_base():
    raw = os.getenv("AGENT47_OSIRIS_URL", "").strip()
    if not raw:
        raise HTTPException(503, "OSIRIS integration disabled")
    parsed = urlparse(raw)
    # Intentionally require a local loopback target. Never accept a user-supplied URL.
    if parsed.scheme != "http" or parsed.username or parsed.password or parsed.path not in ("", "/") or parsed.query or parsed.fragment:
        raise HTTPException(503, "Invalid OSIRIS endpoint configuration")
    if parsed.hostname not in ("127.0.0.1", "localhost", "osiris"):
        raise HTTPException(503, "OSIRIS must use an approved local service name")
    return raw.rstrip("/")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "agent47-research-gateway", "osiris_configured": bool(os.getenv("AGENT47_OSIRIS_URL"))}

@app.get("/api/public/earthquakes/{period}")
async def earthquakes(period: str, request: Request):
    throttle(request)
    if period not in PERIODS:
        raise HTTPException(400, "Allowed periods: day, week, month")
    key = "earthquake:" + period
    now = time.monotonic()
    if key in _cache and now - _cache[key][0] < 120:
        return _cache[key][1]
    try:
        async with httpx.AsyncClient(timeout=12, follow_redirects=False) as client:
            r = await client.get(USGS + PERIODS[period] + ".geojson")
            r.raise_for_status()
            data = r.json()
        if not isinstance(data, dict) or not isinstance(data.get("features"), list):
            raise ValueError("Invalid upstream feed")
        # Bound response size to protect seminar clients.
        if len(data["features"]) > 30000:
            raise ValueError("Feed exceeds maximum supported events")
        result = {"source": "USGS Earthquake Hazards Program", "source_url": USGS + PERIODS[period] + ".geojson", "generated": data.get("metadata", {}).get("generated"), "features": data["features"], "synthetic": False}
        _cache[key] = (now, result)
        return result
    except (httpx.HTTPError, ValueError, TypeError):
        raise HTTPException(502, "Public earthquake feed unavailable")

@app.get("/api/private/osiris/health")
async def osiris_health(request: Request, authorization: str | None = Header(default=None)):
    throttle(request)
    authenticate(authorization)
    base = osiris_base()
    try:
        async with httpx.AsyncClient(timeout=5, follow_redirects=False, trust_env=False) as client:
            response = await client.get(base + "/api/health")
            response.raise_for_status()
            data = response.json()
        return {"source": "OSIRIS local service", "status": data}
    except (httpx.HTTPError, ValueError):
        raise HTTPException(502, "OSIRIS service unavailable")
