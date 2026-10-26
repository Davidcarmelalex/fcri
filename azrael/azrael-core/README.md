# azrael-core

Core autonomous defense engine for the AZRAEL initiative.

## Purpose

`azrael-core` is the central orchestration module — it coordinates detection, response, and healing agents across the AZRAEL mesh.

## Planned Components

```
azrael-core/
├── pyproject.toml        Installable package metadata
├── src/azrael_core/      Importable Python package
│   ├── orchestrator.py   Agent coordination and task routing
│   ├── sense.py          Threat detection and event normalization
│   └── heal.py           Self-healing and recovery modules
├── config/               Default policy configs
├── tests/                Unit and integration tests
└── docs/                 Architecture and API docs
```

## Design Principles

1. **Sovereign** — deployable on any infrastructure, no cloud lock-in
2. **Open** — all policies and rules are auditable
3. **Resilient** — failures are expected; recovery is automatic
4. **Fast** — machine-speed decisions, human-speed reporting

## Status

🚧 **Pre-alpha** — Architecture phase. Implementation begins Q3 2026.

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for the overall contribution guide.
AZRAEL-specific contribution guidelines coming soon.

## Installation

From the repository root, install dependencies and the package in editable
mode in an isolated environment:

```bash
python3 -m venv "$HOME/azrael/venv"
source "$HOME/azrael/venv/bin/activate"
python -m pip install -r azrael/azrael-core/requirements.txt
python -m pip install --editable azrael/azrael-core
```
