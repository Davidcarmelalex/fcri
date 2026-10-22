import os
import secrets

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from .dashboard import render_dashboard
from .registry import AGENTS
from .runtime import run_agent

app = FastAPI(title="AGENT 47", version="0.3.0", docs_url=None, redoc_url=None, openapi_url=None)


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


class ChatRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=8000)
    session: str | None = Field(default=None, max_length=100)


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
        "phase": "M1-constrained-runtime",
        "execution_enabled": bool(os.getenv("AGENT47_MODEL_API_KEY") and os.getenv("AGENT47_MODEL_BASE_URL") and os.getenv("AGENT47_MODEL")),
        "integrations": ["configured-model-provider"] if os.getenv("AGENT47_MODEL_API_KEY") else [],
        "message": "Model-backed chat supports an allowlisted calculator only.",
    }


@app.get("/v1/agents", dependencies=[Depends(require_api_key)])
def agents() -> list[dict[str, object]]:
    return AGENTS


@app.post("/v1/chat", dependencies=[Depends(require_api_key)])
def chat(body: ChatRequest) -> dict[str, str]:
    try:
        return run_agent(body.prompt, body.session)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Model provider request failed") from exc
