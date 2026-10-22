import os
import secrets

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .dashboard import render_dashboard
from .registry import AGENTS

app = FastAPI(title="AGENT 47", version="0.2.0", docs_url=None, redoc_url=None, openapi_url=None)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "no-store"
    return response


def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    configured = os.environ.get("AGENT47_API_KEY", "")
    if not configured or len(configured) < 32:
        raise HTTPException(status_code=503, detail="Service not configured")
    if not x_api_key or not secrets.compare_digest(x_api_key, configured):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/")
def dashboard():
    return render_dashboard()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/v1/status", dependencies=[Depends(require_api_key)])
def status() -> dict[str, object]:
    return {
        "service": "agent47",
        "phase": "ubuntu-deployable-foundation",
        "execution_enabled": False,
        "integrations": [],
        "message": "No external tools or agents are connected.",
    }


@app.get("/v1/agents", dependencies=[Depends(require_api_key)])
def agents() -> list[dict[str, object]]:
    return AGENTS
