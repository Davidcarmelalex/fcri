#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
BASE="http://127.0.0.1:8747"
if [[ ! -f .env ]]; then echo "Missing .env. Run install-ubuntu.sh first." >&2; exit 1; fi
KEY="$(sed -n 's/^AGENT47_API_KEY=//p' .env | tail -n 1)"
if [[ ${#KEY} -lt 32 ]]; then echo "AGENT47_API_KEY missing or too short" >&2; exit 1; fi
echo "Checking health..."
curl --fail --silent --show-error "$BASE/health"
echo
echo "Checking authenticated status..."
curl --fail --silent --show-error -H "X-API-Key: $KEY" "$BASE/v1/status"
echo
echo "Checking skills registry..."
curl --fail --silent --show-error -H "X-API-Key: $KEY" "$BASE/v1/skills"
echo
echo "Checking authentication denial..."
CODE="$(curl -s -o /dev/null -w '%{http_code}' "$BASE/v1/tasks")"
if [[ "$CODE" != "401" ]]; then echo "Expected 401, got $CODE" >&2; exit 1; fi
echo "PASS: API responds, authenticated endpoints work, unauthorized access denied."
echo "NOTE: This does not test an external model provider, workspace race safety, or production security."
