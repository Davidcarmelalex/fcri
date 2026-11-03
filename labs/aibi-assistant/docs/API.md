# Local API

Every `/api/*` endpoint requires `Authorization: Bearer <private user token>`.
Never place tokens in URLs. All POSTs require JSON objects, maximum 20,000 bytes.
No CORS is enabled. Bind address is loopback. API never accepts client-selected
tenant or role. Unknown fields are rejected on actions and assistant requests.

| Method and path | Purpose |
| --- | --- |
| GET /health | Public readiness, mock mode |
| GET /api/me | Server-resolved user, tenant, role |
| GET /api/briefing | Current authorized sections, English |
| POST /api/assistant | `{ "message": "ചെലവ്", "language": "ml" }`; scoped read-only keyword briefing |
| GET /api/records/{kind} | Authorized calendar/tasks/meetings/enrollments/sales/staffing/expenses |
| POST /api/actions | `{ "operation": "…", "data": { … } }`; requires `Idempotency-Key` header of 8–100 chars |
| GET /api/actions | Own requests plus operations this user may review |
| POST /api/actions/{id}/approve | `{ "digest": "exact digest from reviewed proposal" }` |
| POST /api/actions/{id}/reject | Same review digest contract |
| POST /api/actions/{id}/execute | `{}`; requester only; never accepts replacement content |
| GET /api/audit | Latest 200 tenant metadata events, privileged roles |

## Skill payloads

```json
{
  "task.create": {"title":"Review launch","owner":"manager","due":"2026-10-23"},
  "meeting.record": {"title":"Campus review","notes":"യോഗ കുറിപ്പുകൾ","actions":[{"title":"Follow up","owner":"manager"}]},
  "calendar.create": {"title":"Campus review","start":"2026-10-23T09:00:00+05:30","end":"2026-10-23T10:00:00+05:30","attendees":["demo@example.invalid"]},
  "outbound.send": {"recipient":"demo@example.invalid","message":"Draft announcement"},
  "expense.pay": {"payee":"Demo vendor","amount_minor":125000,"currency":"INR"},
  "record.delete": {"record_id":"tenant-scoped ID","reason":"Approved cleanup"},
  "retention.set": {"retention_days":30,"audit_days":365}
}
```

Amounts are integer paise; current prototype only permits INR. Owner must be an
active user in the tenant. Staff can create only self-owned tasks. Meeting action
items are explicit structured tasks, not automatically inferred from notes.

Action results identify `mode: mock` and `external_action_performed: false`.
Task/meeting/calendar records and approved local deletion/retention changes are
real changes to the local pilot database. Simulated payments/messages produce
only the action result, with no external call. Errors use 400 invalid request,
401 credential, 403 permission, 404 missing resource, 409 state/digest conflict,
413 size, 415 content type, 429 rate limit. Error bodies do not expose internals.
