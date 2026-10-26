# AZRAEL release checklist

This checklist separates implemented source from verified release evidence.

## Current milestone: policy authorization boundary

- [x] Proposal carries incident, event, action, target, rationale, and policy version.
- [x] Denied and unapproved proposals are rejected before executor invocation.
- [x] Approval checks role, expiry, revocation, and exact proposal binding.
- [x] Approval identifiers are single-use within the orchestrator process.
- [x] Kill switch, timeout, cancellation, and dry-run paths are represented in the core API.
- [ ] Persist claims and approvals across restart and concurrent workers.
- [ ] Reproduce the test suite in a supported environment and publish CI evidence.

### Integration evidence

The original server milestone is preserved as commit
`010e16b0f19a154051e4e24ca32b77022670c431` on
`codex/azrael-policy-010e16b`. Its baseline reproduced as 11 passed / 1 failed;
the replay test expected RuntimeError while the implementation raised PermissionError.

The separate policy integration combines that work with the plan-before-execute
pipeline from PR #9. It preserves the existing regression suite, corrects the
replay assertion, validates issued proposals/approvals, and routes normal agent
execution through the kill-switch and policy boundary. The integrated suite
passes 45 tests on local Python 3.12. Ubuntu CI must also pass before review.

Identity and role strings are currently supplied by trusted in-process callers;
this is not operator authentication. Durable storage, multi-process claims,
authenticated controls, bounded retention, and production recovery remain open.

## Backlog and acceptance criteria

| Task | Depends on | Acceptance criteria |
| --- | --- | --- |
| Durable event/incident/audit store | policy boundary | migration, restart, concurrency, retention, backup/restore tests pass |
| Versioned telemetry adapter | durable store | fixture replay validates schemas, deduplication, limits, and bounded retries |
| Recovery workflow | durable store, policy boundary | authorized restore validates snapshot/baseline, rollback and interruption are audited |
| Authenticated operator API/console | policy boundary, durable store | unauthorized approval/execution is rejected; workflow is paginated and request-traced |
| Deployment and operations | API/console, durable store | install, health/readiness, upgrade, rollback, and restoration smoke tests pass |
| Build World evidence | deployment | live route shows accurate heartbeats, reconnect/failure states, mobile and reduced-motion behavior |

The release is not ready while unchecked acceptance criteria remain. Distributed
swarm operation, intelligence feeds, ATT&CK mappings, and SDK capabilities are
explicitly deferred until separately implemented and verified.
