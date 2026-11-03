#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python -c 'import sys; assert sys.version_info >= (3, 11), "Python 3.11+ required"'
python -m pip install --editable .
python -c 'import azrael_core; print("azrael_core", azrael_core.__version__)'
python -m pip check
python -m pytest --collect-only -q tests
python -m pytest -q tests
