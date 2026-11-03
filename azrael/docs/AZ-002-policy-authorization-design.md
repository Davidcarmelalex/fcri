# AZ-002 Policy Authorization — Design and Mock Contract

Status: design-only. This document does not change the live orchestrator or any
external integration.

## Scope

AZ-002 defines the authorization boundary for a response proposed for a threat
event. Authorization must be decided before an action executor or integration is
called. A denied proposal is observable only as a policy decision/audit record;
it must not invoke an executor, mutate an external system, enqueue a retry, or
mark the event handled.

## Approval matrix

The matrix is expressed in terms of the response action, not the agent that
proposed it. `Approve` means the action may be handed to an executor. `Deny`
means the proposal is rejected and has no side effects.

| Threat level | ALERT | REPORT | ISOLATE | BLOCK | QUARANTINE | RESTORE |
|---|---:|---:|---:|---:|---:|---:|
| LOW | Approve | Approve | Deny | Deny | Deny | Deny |
| MEDIUM | Approve | Approve | Deny | Deny | Deny | Deny |
| HIGH | Approve | Approve | Approve | Approve | Deny | Deny |
| CRITICAL | Approve | Approve | Approve | Approve | Approve | Approve |

This is the effective matrix of the current `PolicyEngine` defaults. The
`manual` policy bucket contains `QUARANTINE`, but it is not an approval path by
itself: manual actions remain denied unless a separately defined approval
workflow exists. AZ-002 treats that workflow as out of scope for this task.

## Decision and side-effect semantics

1. Validate the proposal and event context.
2. Evaluate exactly one policy decision for the action and threat level.
3. If denied, emit an auditable denial result containing event ID, action,
   threat level, policy reference, and reason. Do not call the executor or any
   integration, do not enqueue work, and do not set `event.handled`.
4. If approved, call the executor once with the approved response. Only an
   executor success may make the event handled; an authorization decision alone
   does not.
5. An executor exception is an execution failure, not an authorization denial;
   it must be recorded without retrying implicitly.

The authorization gate should therefore sit between response proposal and
execution. The current implementation does not yet provide that boundary:
`AzraelOrchestrator._process()` calls `agent.handle(event)` first and only then
filters the returned `DefenseResponse`. The existing behavior is intentionally
left unchanged by this task.

## Mock contract shape

The accompanying tests use a local mock harness with three collaborators:

- `MockPolicy`: returns the matrix decision and records evaluations.
- `MockExecutor`: records calls and represents all external side effects.
- `MockGate`: models the proposed ordering (authorize, then execute).

These tests are contract tests, not a replacement implementation. They do not
instantiate or patch the production orchestrator and do not contact external
systems.
