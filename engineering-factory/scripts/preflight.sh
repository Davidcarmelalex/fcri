#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
command -v git >/dev/null
command -v python >/dev/null
python -c 'import sys; assert sys.version_info >= (3, 11), "Python 3.11+ required"'
test -f azrael/azrael-core/src/orchestrator.py
test -f azrael/azrael-core/tests/test_orchestrator.py
printf '\nRepository revision\n'
git rev-parse HEAD
git status --short
printf '\nRuntime\n'
python --version
python -m pip check
python -m pip freeze
printf '\nBaseline test collection (expected to expose AZ-001 before repair)\n'
python -m pytest --collect-only -q azrael/azrael-core/tests
printf '\nBaseline tests\n'
python -m pytest -q azrael/azrael-core/tests
