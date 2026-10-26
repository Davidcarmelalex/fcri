# Planning, authorization, and execution

Agents now implement `plan(event) -> ResponsePlan | None` and
`execute(plan) -> bool`. Planning must have no external side effects. The
orchestrator validates the proposal, evaluates policy, records authorization,
and only then invokes execution. It never calls the legacy `handle()` method.
Migrate existing agents; legacy-only agents are rejected during registration.

`ResponsePlan` is immutable. Planning gets a deep copy of telemetry so that it
cannot change the severity used for authorization. Event IDs, action enums, and
required proposal fields are validated. Execution receives the exact proposal
that passed policy. Planning is a trusted code contract, not a sandbox: a
malicious Python agent can still perform side effects in `plan()`.

## Existing policy retained

| Severity | Automatically authorized by current policy |
| --- | --- |
| LOW / MEDIUM | ALERT, REPORT |
| HIGH | ALERT, REPORT, ISOLATE, BLOCK |
| CRITICAL | Every ResponseAction, including QUARANTINE and RESTORE |

This change fixes ordering, not the approval matrix. There is no human approval
service yet. The names `supervised` and `manual` in the old configuration do not
implement operator approval. Changing the critical override or adding approval
tokens is a separate product decision. This is not a production readiness claim.

## Outcomes and retries

`DefenseResponse.success` reflects the executor's boolean result. Only success
marks an event handled. Failures, denial, invalid plans, cancellation and
successful execution are visible through `get_audit_log()` and Python logging.
The returned audit list is a copy and its records are frozen.

Execution is attempted at most once per `(event ID, agent ID)` during the
orchestrator instance's lifetime, including concurrent duplicate processing.
The claim occurs before awaiting execution. Errors and cancellation can leave
an uncertain external outcome, so neither is automatically retried. This is
not durable exactly-once execution: state is in memory, resets on restart,
grows with event volume, and is not shared between processes. Production needs
durable idempotency keys, an audit sink, bounded retention, and reconciliation.

Exceptions from one agent are audited without stopping the other agents.
Task cancellation propagates to the caller. Tests use mock executors only.
The standalone HealLayer is not routed through this pipeline yet; callers
must not expose it as an automatically authorized recovery service.
