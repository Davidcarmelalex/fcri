# AZRAEL: three-minute presentation

## Opening statement

“AZRAEL is being built as a governed cyber-defense platform. Today we will show
a working slice: a suspicious event becomes a proposed response, policy prevents
premature execution, an operator authorizes the exact action, and the system
records the result. We use synthetic incidents and simulated hosts so the
demonstration is repeatable.”

The business value to emphasize is **controlled response with inspectable
evidence**. A higher severity does not need to mean unchecked autonomy. This
demo makes the permission boundary and its effect visible.

The intended hosted demo is `https://agentrunme.com/azrael-demo/`; verify the
actual deployed revision before the meeting. The local walkthrough has been
exercised through denial, approval, mock execution, and replay refusal. Current
local milestone evidence is 54 passing Python tests and four passing Node tests.

## Three-minute walkthrough

### 0:00–0:25 — Set the scene

Open the demo and identify the synthetic-environment label. Select the
credential-stuffing preset: high severity and a proposed block action.

Say: “This is the evidence entering the system. The detector uses explicit rules
to classify it; the response is a proposal, not permission to act.”

Point to the incident, mock target, severity, and action. Do not describe the
signal as a real attack or the normalization rules as a machine-learning model.

### 0:25–0:55 — Show the policy gate

Click **Try without approval** before granting approval.

Say: “The system refuses the action because the required approval is missing.
The target has not changed, and the executor has not run.”

Show the refusal and unchanged target or execution count. This is the most
important proof in the demo: governance changes behavior, not just a badge.

### 0:55–1:25 — Approve and execute

Click **Approve response**, then **Execute on mock target**.

Say: “Approval is tied to this proposal, incident, target, action, and policy
version. The real core validates it before the mock executor runs.”

Point to the mock target's new state and the recorded success. Explain that this
is a simulated block, not a change to a live network.

### 1:25–1:50 — Prove replay protection

Click **Test replay protection** to attempt execution again with the same
proposal or approval.

Say: “Reusing the same authorization cannot repeat the action. The execution
count remains one.”

If the interface disables the execution button, use the provided replay-check
control rather than claiming that a disabled button alone proves server behavior.

### 1:50–2:15 — Show the evidence

Open the audit timeline and click **Export evidence** to save the JSON record.

Say: “The decisions are inspectable: proposal, denial, approval, execution, and
replay refusal. This export is a demonstration record. Durable audit storage is
part of the next engineering stage.”

### 2:15–2:40 — Show configurable governance

Click **Reset this demo session**, then choose the critical ransomware-signal
preset. Show that quarantine still
requires approval because the demo explicitly disables the critical override.

Say: “A critical label does not have to remove human control. Here the policy is
configured to require approval even at critical severity.”

Do not imply that this configuration is the default everywhere in the repository.
The legacy override remains configurable and enabled by default in the core.

### 2:40–3:00 — Close with the roadmap

Briefly open Build World to show the actual GitHub work and recent status.

Say: “The next milestones are durable execution state, authenticated operator
access, and tested real adapters. The repository, checks, and explicit release
backlog make that progress reviewable.”

If time is short, skip the ransomware preset rather than rushing through the
approval and replay evidence.

## Capability matrix for questions

| Capability | What this demonstration establishes | What it does not establish |
| --- | --- | --- |
| Telemetry | A synthetic event enters the real normalization path | A deployed fleet collecting real endpoint telemetry |
| Detection | Deterministic severity rules produce an explainable result | A trained detection model, measured detection accuracy, or threat attribution |
| Policy | Real automatic, approval-required, and denied decisions | A finalized production policy for every customer environment |
| Approvals | Exact proposal binding, expiry/revocation checks, and single-use enforcement in the core | Production login, identity verification, SSO, or externally trusted operator roles |
| Response | Policy permits a mock executor only after required checks | A live firewall block, endpoint isolation, or malware quarantine |
| Audit | The visible decision sequence and downloadable JSON evidence | A durable, tamper-evident production audit service |
| Replay protection | The same action claim/approval cannot be reused in one running core instance | Durable claims across restarts or independent workers |
| Critical threats | Demo configuration can require approval for critical actions | A universal claim that the core's default critical override is disabled |
| Build World | Live repository information and explicitly sourced status updates | Proof that every animated character is a continuously running agent |
| Recovery | A roadmap item with existing prototype code | A fully authorized, verified production self-healing system |

## Demo-release acceptance checklist

Only mark these complete after checking the actual release revision:

- [ ] A clean supported environment starts the demo using the README.
- [ ] The public `/azrael-demo/` page and its relative assets load correctly.
- [ ] The existing website and `/azrael-world/` still work.
- [ ] Each preset displays the correct severity, action, and policy mode.
- [ ] Missing approval produces a server-side refusal and zero execution.
- [ ] Approved execution produces exactly one mock-target state change.
- [ ] Replay is refused by the core, not merely hidden by the interface.
- [ ] Audit export contains the actual current scenario and results.
- [ ] Reset and independent sessions behave correctly.
- [ ] Arbitrary hosts, commands, and production executors cannot be submitted.
- [ ] Core and demo tests pass; CI evidence is recorded.
- [ ] The local backup works on the presentation computer without internet.
- [ ] Fallback screenshots and audit JSON are saved locally.
- [ ] The exact source revision, deployment instructions, and known limits are in GitHub.

## Rehearsal and fallback

The presentation time is not yet specified. Rehearse on the presentation
computer and display before the meeting, then leave the verified version stable.
Avoid last-minute framework upgrades or unrelated refactors.

Prepare three browser tabs: the demo, Build World, and the repository or release
PR. Start with a fresh demo session. Increase the browser text size only after
checking that the action controls and audit timeline still fit.

Keep the complete extracted local kit and its `START-DEMO.cmd` launcher
available. `start-demo.ps1 -NoBrowser` starts the same local service without
opening a browser automatically. The kit includes the core source in a sibling
directory and needs no pip installation to run. If the
server or venue internet is unavailable, switch to the local demo and explicitly
say that it runs the same core against synthetic inputs. Build World's external
GitHub information may be unavailable offline; do not present cached data as a
fresh live update.

If the executable demo fails, show the saved screenshots and audit export as
recorded evidence, clearly stating that they come from rehearsal. Do not narrate
a recording or screenshot as live execution.

For difficult questions, separate “shown today,” “implemented elsewhere but not
verified by this demo,” and “planned.” That distinction makes the demonstration
credible and keeps the next engineering milestones clear.
