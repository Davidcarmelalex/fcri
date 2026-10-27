# AZRAEL presentation demo

A repeatable, isolated demonstration of the real AZRAEL policy core using
synthetic telemetry and mock targets. This demo is designed to show a concrete
workflow, not to claim that the complete production platform is finished.

See [PRESENTATION.md](PRESENTATION.md) for a three-minute walkthrough, capability
boundaries, and rehearsal checklist.

**Intended hosted route:** https://agentrunme.com/azrael-demo/
Deployment verification is a separate release step; the link alone is not a
claim that this revision has been deployed. The existing live development view
is [Build World](https://agentrunme.com/azrael-world/).

Local milestone evidence: **54 Python tests and four Node tests passed**. The
browser flow was exercised through high-severity injection, unapproved denial,
approval, mock execution, and replay refusal. Recheck the release revision and
CI before presenting.

## What to demonstrate

1. Load a predefined synthetic incident.
2. Inspect its normalized severity and proposed defensive action.
3. Attempt execution without approval and see the refusal.
4. Approve the exact proposal, then execute it on the mock target.
5. Attempt the same action again and see replay protection.
6. Inspect and export the audit evidence as JSON.

| Preset | Severity | Proposed action | Intended policy behavior |
| --- | --- | --- | --- |
| Credential stuffing | High | Block | Operator approval required |
| Ransomware signal | Critical | Quarantine | Operator approval required; critical override disabled |
| Suspicious login | Low | Alert | Automatic action; no disruptive executor |

The ransomware preset is a synthetic signal. The demonstration does not execute
malware, attack infrastructure, change a real firewall, or quarantine a real host.

## Run locally

Requires Python 3.11 or newer. The HTTP service uses Python's standard library;
the demo also imports the local `azrael_core` package.

From the repository root on Ubuntu or another Unix-like shell:

```sh
python3 -m venv .venv-demo
. .venv-demo/bin/activate
python -m pip install --editable ./azrael/azrael-core
cd azrael/presentation-demo
python server.py
```

Open `http://127.0.0.1:3089/`. Keep the terminal running during the presentation.

For a source-only launch without installing the core package:

```sh
cd azrael/presentation-demo
PYTHONPATH=../azrael-core/src python3 server.py
```

From PowerShell, after installing the core into your selected Python environment:

```powershell
Set-Location azrael/presentation-demo
python server.py
```

If using the source-only PowerShell approach:

```powershell
Set-Location azrael/presentation-demo
$env:PYTHONPATH = (Resolve-Path ../azrael-core/src).Path
python server.py
```

### Windows offline presentation kit

Extract the complete presentation ZIP, keeping `presentation-demo/` and
`azrael-core/` as sibling directories. Double-click `START-DEMO.cmd` inside
`presentation-demo/`. The launcher uses the included core source, starts a local
server, and opens `http://127.0.0.1:3089/`; no pip installation is required.

To start without opening a browser automatically:

```powershell
.\start-demo.ps1 -NoBrowser
```

The launcher first checks for an existing matching demo server, then looks for
the prepared computer's bundled Python or a regular Python executable. Another
computer still needs Python 3.11 or newer. Rehearse the extracted kit on the
actual presentation computer, with networking disabled, before relying on it.
Do not assume a different computer has the same Python installation path.

Launcher diagnostics are in `.demo-logs/`. Do not publish that runtime directory
as release source or include unrelated system logs in presentation evidence.

## Server hosting

The intended deployment is a dedicated service listening on
`127.0.0.1:3089`, behind the existing Nginx proxy at `/azrael-demo/`. Use a trailing
slash on the public route so its relative assets and requests resolve correctly.

Keep this service separate from the live Build World at `/azrael-world/`, the
existing website, and any production defensive execution system. Test the active
proxy configuration before reload and retain its previous configuration for
rollback. Service and proxy deployment must be verified on the actual server;
these instructions alone are not evidence that a public deployment is healthy.

The public demonstration must expose only fixed synthetic scenarios and mock
actions. It must not accept arbitrary target hosts, shell commands, executor
plugins, or production credentials. Demonstration approval represents an
in-process policy decision, not an authenticated production operator identity.

## Test and rehearsal

Run the core test suite from the repository root in an environment with pytest:

```sh
python -m pip install pytest pytest-asyncio
python -m pytest -q azrael/azrael-core/tests
```

Run both the core and presentation demo tests before release:

```sh
python -m pytest -q azrael/azrael-core/tests azrael/presentation-demo/tests
```

Build World has a separate Node validation suite:

```sh
node --test azrael/build-world/test/activity.test.mjs
```

Record the actual count and results from that revision rather than copying an
earlier branch's numbers. The tests require pytest/pytest-asyncio, but the
standalone presentation runtime does not.

Before presenting:

- Test all three presets in the actual browser and display setup.
- Verify denial does not change the mock target.
- Verify approved execution changes the mock target exactly once.
- Verify a second execution is refused and the execution count remains one.
- Export audit JSON and confirm it matches the visible scenario.
- Reset and repeat; verify a fresh browser session is independent.
- Start the local backup and repeat the credential-stuffing flow with networking
  disabled. Do not discover missing runtime dependencies during the presentation.
- Keep fallback screenshots and exported JSON accessible locally.

## Important limits

- Detection uses deterministic normalization and severity rules. It is not a
  trained AI model or evidence of autonomous reasoning beyond those rules.
- All targets and effects are simulated. Policy and approval code are real.
- Approval is enforced within the core, but production login, identity proof,
  role provisioning, and multi-user authorization remain separate work.
- The demonstration state and execution claims are in memory. Restarting clears
  them. A JSON export is evidence output, not a durable audit database.
- The complete recovery, real adapter, swarm, intelligence-feed, and production
  operating capabilities are not established by this demonstration.

Keep those boundaries visible in the presentation and in any shared recording.
