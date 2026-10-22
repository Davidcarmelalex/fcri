# AGENT 47 — FCRI / AIBI Command Center

An isolated, security-first foundation for the FCRI and AIBI director command center. This is a working API skeleton, not a deployed autonomous agent or verified Hermes integration.

## Local start

```bash
cd apps/agent47
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export AGENT47_API_KEY="$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')"
uvicorn app.main:app --host 127.0.0.1 --port 8747
```

Call `GET /health` without authentication, or `GET /v1/status` with `X-API-Key`. Do not expose port 8747 publicly. Use TLS and an authenticated reverse proxy/VPN for remote access.

## Security boundaries

* No shell, browser, network reconnaissance, or external tool execution.
* No production integration with Hermes, God’s Eye View, Osiris, or GitHub until APIs and permissions are reviewed.
* API keys are read from the environment; missing keys prevent authenticated API access.
* This single shared-key prototype is **not** director-level identity or RBAC. Before onboarding directors, add SSO/MFA, per-user permissions, audit logs, and approval-gated actions.
* The prototype dashboard accepts the API key in browser memory (not persistent storage). Only use it over localhost or a trusted private tunnel; never on a publicly exposed HTTP endpoint.

## Roadmap

1. Identity: OIDC SSO + MFA + director-scoped roles.
2. Durable job queue, immutable audit events, rate limits, telemetry.
3. Provider adapters and a reviewed skill registry with deny-by-default tool permissions.
4. Human approval workflow for side effects.
5. Web dashboard and isolated seminar demonstration mode.
6. Ubuntu deployment manifests, CI checks, backup and recovery drills.
