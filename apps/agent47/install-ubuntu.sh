#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  echo "Docker Engine with Compose plugin is required. Install from Docker's official Ubuntu instructions." >&2
  exit 1
fi
if [[ ! -f .env ]]; then
  umask 077
  SECRET="$(python3 -c 'import secrets; print(secrets.token_urlsafe(48))')"
  printf 'AGENT47_API_KEY=%s\n' "$SECRET" > .env
  echo "Generated .env (mode 600). Keep the API key secret."
fi
chmod 600 .env
docker compose up -d --build
docker compose ps
echo "Agent 47 available locally at http://127.0.0.1:8747"
echo "For remote access use a private VPN or authenticated HTTPS reverse proxy. Do not expose port 8747 publicly."
