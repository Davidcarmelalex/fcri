#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$0")"
if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  echo "Docker Engine and Compose plugin required. See DEPLOY.md" >&2
  exit 1
fi
umask 077
if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env. Add NEW BotFather token, OpenAI API key, and your numeric Telegram user ID."
  echo "Run: nano .env"
  exit 2
fi
if ! grep -Eq "^TELEGRAM_BOT_TOKEN=[^[:space:]]+" .env || grep -Eq "^TELEGRAM_BOT_TOKEN=replace_" .env || ! grep -Eq "^AGENT47_ALLOWED_USER_IDS=[0-9]+(,[0-9]+)*$" .env || grep -Eq "^AGENT47_ALLOWED_USER_IDS=123456789$" .env; then
  echo "Set valid TELEGRAM_BOT_TOKEN and AGENT47_ALLOWED_USER_IDS in .env first." >&2
  exit 2
fi
docker compose build
docker compose up -d
docker compose ps
echo "AGENT47 container launched. Verify with: docker compose logs --tail=50 agent47"
