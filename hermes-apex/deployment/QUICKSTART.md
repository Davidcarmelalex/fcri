# Staging quickstart (no Hermes calls yet)

From hermes-apex/:

```bash
python3 -m unittest discover -s tests -v
python3 -m src.orchestrator roles
python3 -m src.orchestrator submit --role scholar --objective "Prepare FCRI course outline"
python3 -m src.orchestrator list
```

This is an approval-gated task registry and queue prototype, not a live model-powered worker. Verify Hermes integration against the installed runtime before enabling execution. Do not commit runtime/ or secrets.
