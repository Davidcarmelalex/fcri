# AZRAEL

**Governed cyber defense: permission before action, evidence after action.**

AZRAEL is FCRI's open cyber-resilience initiative. The current release target is
a presentation-ready demonstration of the policy core, using synthetic telemetry
and simulated targets. It is not a completed production defense platform.

## Try the presentation demo

- **Intended hosted demo:** [Defense in motion](https://agentrunme.com/azrael-demo/)
  — deployment health must be verified for the release revision.
- **Live development view:** [Build World](https://agentrunme.com/azrael-world/)
  — repository activity and explicitly sourced work updates.
- **Three-minute walkthrough:** [Presenter script](presentation-demo/PRESENTATION.md).
- **Setup and scope:** [Demo README](presentation-demo/README.md).

The demonstration makes one decision chain visible:

```text
Synthetic signal → rule-based detection → response proposal → policy gate
                                        ↓
                     unapproved request refused
                                        ↓
                 bound approval → mock execution → audit evidence
                                        ↓
                         replay request refused
```

Choose a credential-stuffing scenario, attempt an unapproved block, grant
approval, execute against the mock target, test replay protection, and export
the actual audit sequence. The critical ransomware-signal preset also requires
approval because the demo explicitly disables the legacy critical override.

### Quick start without package installation

Python 3.11 or newer is required. From the repository root:

```sh
cd azrael/presentation-demo
PYTHONPATH=../azrael-core/src python3 server.py
```

Open `http://127.0.0.1:3089/`. The service and core use the included source; the
demo runtime requires no third-party Python packages or network services.

On the prepared Windows presentation computer, double-click
`azrael/presentation-demo/START-DEMO.cmd`, or run
`azrael/presentation-demo/start-demo.ps1`. The complete offline package must
retain `presentation-demo/` and `azrael-core/` as sibling directories.

## What works in this milestone

| Capability | Implemented behavior |
| --- | --- |
| Event normalization | Synthetic telemetry passes through the real Python severity rules |
| Policy decisions | Explicit automatic, approval-required, and denied modes |
| Bound approvals | Proposal, incident, event, action, target, policy version, and expiry checks |
| Execution controls | Single-use approvals, execution claims, kill switch, dry-run, timeout, and cancellation handling |
| Presentation console | Isolated browser sessions, predefined scenarios, mock responses, replay checks, and JSON evidence export |
| Build World | Original pixel-art progress view with real GitHub information, workspace observations, and agent heartbeats |

Local verification for the presentation milestone: **54 Python tests and four
Node tests passed**. The browser walkthrough was exercised through unapproved
denial, approval, mock execution, and replay refusal. Confirm the release PR and
CI results for the exact revision being presented; these results do not certify
live endpoint protection.

## Scope and limitations

The policy checks are real code; defensive targets and effects in the demo are
simulated. Approval currently uses trusted in-process identity and role values,
not a production identity provider. Session state, approvals, audit records, and
execution claims are in memory. Restarting clears them.

The core's compatibility critical override remains enabled by default unless
explicitly disabled. The presentation configuration disables it; this setting
must not be generalized to every deployment.

Durable storage and claims, authenticated operator access, real endpoint
adapters, governed recovery, production backup/restore, distributed swarm
operation, intelligence feeds, ATT&CK mappings, and SDK maturity remain separate
release work. Prototype recovery code does not establish a production
self-healing capability.

See the [release checklist](AZRAEL_RELEASE_CHECKLIST.md) for outstanding work and
evidence. No production action is performed by the presentation service.

## Repository map

| Path | Purpose |
| --- | --- |
| [`azrael-core/`](azrael-core/) | Python policy, orchestration, sensing, and recovery prototypes |
| [`presentation-demo/`](presentation-demo/) | Synthetic incident console and presenter material |
| [`build-world/`](build-world/) | Server-hosted pixel-art development dashboard |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Intended system architecture |
| [`GOVERNANCE.md`](GOVERNANCE.md) | Governance principles |
| [`AZRAEL_RELEASE_CHECKLIST.md`](AZRAEL_RELEASE_CHECKLIST.md) | Release gates and deferred capabilities |

Contributions follow the repository's [contribution guide](../CONTRIBUTING.md).
Changes should include executable evidence, explicit limitations, and reviewable
PRs. Keep the presentation environment separate from production defensive
execution systems.
