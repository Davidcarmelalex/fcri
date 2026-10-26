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

## Explicit approval policy

| Severity | Automatic | Approval required | Denied |
| --- | --- | --- | --- |
| LOW / MEDIUM / HIGH | ALERT, REPORT | ISOLATE, BLOCK, QUARANTINE | RESTORE |
| CRITICAL (compatibility override enabled) | Every ResponseAction | None | None |
| CRITICAL (override disabled) | ALERT, REPORT | ISOLATE, BLOCK, QUARANTINE | RESTORE |

The approval milestone interprets configured `supervised` and `manual` actions
as approval-required. `authorize()` returns true only for automatic actions;
callers must use the orchestrator's execution boundary to consume an approval.
The legacy critical override remains enabled by default and can be explicitly
disabled with `PolicyEngine(critical_override=False)`. Empty configurations and
empty allowed-role sets are respected, rather than replaced with defaults.

Only proposals and approvals issued by this orchestrator instance are accepted.
They bind the exact event, incident, action, target, policy version, and expiry.
Proposals, policy changes, role changes, revocation, and expiry are revalidated
immediately before claiming execution. Dry-run validates permission but neither
claims execution nor consumes an approval. Its success means validation passed,
not that an external action occurred. The audit marks it `execution_dry_run`.

Normal agent processing uses this same execution boundary. Approval-required
plans remain pending and never invoke the agent executor. A trusted caller can
inspect `get_pending_proposals()`, issue an approval, and execute the exact
proposal using a configured Executor. Legacy `handle()` agents remain rejected.

This is an in-process authorization framework, not an authenticated operator
service. The caller supplies operator identity and role; the future authenticated
API must establish those values from a trusted identity provider, never request
body strings. Kill-switch and revocation methods likewise require an authenticated
control plane before being exposed remotely. No such endpoint is added here.

## Outcomes and retries

`DefenseResponse.success` reflects the executor's boolean result. Only success
marks an event handled. Failures, denial, invalid plans, cancellation and
successful execution are visible through `get_audit_log()` and Python logging.
The returned agent audit list is a copy and its records are frozen. The policy
milestone's separate `audit.records` sink remains an internal, mutable in-memory
reference sink. Production requires a durable access-controlled audit service.

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
