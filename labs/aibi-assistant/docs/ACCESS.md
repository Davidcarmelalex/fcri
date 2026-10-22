# Missing access and integration contracts

No AIBI production credentials or endpoints were provided. All shipped adapters
are mock-only and report `external_action_performed: false` even after approval.
Existing GitHub access does not grant access to AIBI campus systems.

| System | Required before implementing a real adapter |
| --- | --- |
| Identity | AIBI's identity provider, issuer/audience, allowed groups, user/tenant mapping, MFA and deprovisioning requirements |
| Calendar/tasks | Actual Microsoft/Google/other provider, authorized test account, OAuth consent, minimal scopes, calendar ownership and timezone |
| Meetings | Approved notes/transcription source, participant consent policy, storage and retention decisions |
| Enrollment/sales | Verified CRM/LMS or database documentation, sandbox endpoint, read-only service account and field definitions |
| Staffing | HR/roster source, authorized fields and team scopes; avoid payroll/medical data unless explicitly required |
| Expenses | Actual accounting provider, read-only reporting access first; finance approvers, limits and provider transaction IDs |
| Outbound | Authorized channel, approved sender identity, recipients policy, OAuth scopes and provider delivery/idempotency contract |
| Deployment | Owner-approved environment/domain, secret manager, TLS proxy, backup/restore target and incident owner |
| AI inference | Completed secure provider setup and selected model, explicit data-sharing approval, bilingual quality evaluation and usage budget |

Adapter design: accept a **server-created principal** and a validated operation;
never take tenant identity from the model or caller payload. Read adapters return
scoped source IDs, timestamps and freshness. Write adapters consume immutable
approved action IDs through an outbox and reconcile provider delivery IDs.
Provider OAuth tokens are server secrets associated with the correct tenant;
never reuse management bearer tokens as downstream provider credentials.

The connection/plugin inventory available to this chat is not proof of authorization
to a particular campus account. No outbound messages, calendar invitations,
payments or destructive operations have been performed on external systems.
