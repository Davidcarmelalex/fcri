# AGENT47 research web stack — local preview deployment

**Status: not yet validated on an Ubuntu host.** This Compose stack starts a static nginx seminar webapp and the separate research gateway on loopback-only ports. It does **not** start OSIRIS, God's Eye View, AGENT47 Telegram, or an authenticated executive backend.

## Prerequisites
Ubuntu with Docker Engine and Docker Compose plugin. Rotate any previously disclosed Telegram token; this web stack does not use it.

## Setup
```bash
cd agent47/gateway
cp .env.example .env
chmod 600 .env
python3 -c 'import secrets; print(secrets.token_urlsafe(48))'
# Edit .env: replace AGENT47_GATEWAY_TOKEN with the generated value.
cd ../deploy
docker compose config
docker compose up -d --build
curl -fsS http://127.0.0.1:8787/health
curl -fsSI http://127.0.0.1:8088/launch.html
```

Open `http://127.0.0.1:8088/launch.html` **on the server itself**, or use an SSH tunnel from your laptop:
```bash
ssh -L 8088:127.0.0.1:8088 USER@SERVER
```
Then open `http://127.0.0.1:8088/launch.html` on the laptop.

**Do not publish ports 8088 or 8787 directly to the internet.** Production needs HTTPS, a hardened proxy, authorized access, managed secrets, provider terms review and monitoring. The webapp currently requests USGS directly from the browser; the gateway is not yet wired to the frontend.

## Stop / rollback
```bash
docker compose down
```
Use a pinned Git commit for reproducible deployments. Verify Docker healthchecks and frontend CDN/imagery behavior in the target environment.
