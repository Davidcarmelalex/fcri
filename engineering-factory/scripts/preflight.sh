#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
command -v git >/dev/null
command -v python >/dev/null
python -c 'import sys; assert sys.version_info >= (3, 11), "Python 3.11+ required"'
test -f azrael/azrael-core/src/azrael_core/orchestrator.py
test -f azrael/azrael-core/tests/test_orchestrator.py
python -m pip install --editable azrael/azrael-core
python -c 'import azrael_core; print("azrael_core", azrael_core.__version__)'
printf '\nRepository revision\n'
git rev-parse HEAD
git status --short
printf '\nRuntime\n'
python --version
python -m pip check
python -m pip freeze
printf '\nTest collection\n'
python -m pytest --collect-only -q azrael/azrael-core/tests
printf '\nBaseline tests\n'
python -m pytest -q azrael/azrael-core/tests
