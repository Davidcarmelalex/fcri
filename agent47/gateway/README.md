# AGENT47 Research Gateway — Alpha

A separate, read-only FastAPI service for the FCRI seminar webapp. This is a first backend implementation, **not production deployed or verified against a live OSIRIS installation**.

## Routes
- `GET /health` — health and configuration status, no secrets
- `GET /api/public/earthquakes/day|week|month` — cached USGS public observations
- `GET /api/private/osiris/health` — bearer-token protected health check for an explicitly configured local OSIRIS service; disabled by default

No arbitrary proxy URL, active scanning, write operations, shell execution, or model credentials in browser code.

## Local setup
From `agent47/gateway`:
```bash
cp .env.example .env
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
# Paste the generated secret into .env privately. Never commit .env.
docker compose up -d --build
curl http://127.0.0.1:8787/health
```
Install Docker Compose first. Compose binds only to loopback. Configure HTTPS reverse proxy, authentication, CORS, rate limiting and auditing before public deployment.

## Development tests
From `agent47` with Python dependencies installed:
```bash
python3 -m pytest gateway/tests -q
```

## Security caveats
- Private bearer token is service-to-service only; **never embed it in a public web page**.
- This is not director IAM; Telegram identity, tenant scope and per-skill grants must be enforced at the real AGENT47 agent/tool boundary.
- Local per-process throttling is insufficient for internet exposure; use reverse-proxy limits.
- The optional `osiris` hostname is only safe in an isolated Docker network with controlled DNS; avoid attaching untrusted containers.
- Restrict egress at the infrastructure layer and verify OSIRIS endpoint response schemas.
- USGS event data can be large; a reverse proxy should enforce body-size and request limits.
- Protect API access using HTTPS and a proper gateway before any browser frontend connects.
