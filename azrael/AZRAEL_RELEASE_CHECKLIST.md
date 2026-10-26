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
