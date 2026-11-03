# AIBI Executive Desk · FCRI Labs

An Agent47-based, multi-user management assistant with a runnable browser desk,
tenant-scoped SQLite storage, bilingual briefings and durable approval workflows.
**Status: reviewable local pilot; all campus integrations are mock adapters.**

This build reuses the actual Agent47 task/result contracts and subclasses its
dispatcher. It deliberately does not expose Agent47's general command executor.
See [PROVENANCE.md](PROVENANCE.md) for verified source and findings.

## Install and run

Requires Python 3.11+; no third-party packages or API key needed for mock mode.
From `labs/aibi-assistant` in this repository:

```sh
python -m aibi user --tenant aibi-demo --user manager --role admin --token-file runtime/manager.token
python -m aibi user --tenant aibi-demo --user reviewer --role admin --token-file runtime/reviewer.token
python -m aibi user --tenant aibi-demo --user admissions --role admissions --token-file runtime/admissions.token
python -m aibi seed-demo --tenant aibi-demo --user manager
python -m aibi serve
```

Open `http://127.0.0.1:4780`. Select the manager credential file. Use a second
browser/private window and the reviewer credential to test separate approval.
The credential is held only in browser memory. Local files are secrets: exclude
them from source control, restrict access to their owner and deliver each only to
its intended user through an approved secure channel. Windows operators must set
user-only NTFS ACLs; POSIX mode flags do not enforce Windows ACLs.

Tokens expire after 12 hours (maximum 24 via `--hours`). Reissue to a new token
filename. Revoke all of a user's credentials immediately:

```sh
python -m aibi revoke --tenant aibi-demo --user admissions
python -m aibi purge --tenant aibi-demo
python -m unittest discover -s tests -v
```

`--db /absolute/path/aibi.sqlite` is a global option before the subcommand.
The operator with database/filesystem access is trusted and can provision roles;
there is no public signup, default password or fallback signing key.

## What works

- Executive briefings filtered by authenticated role, in English or Malayalam.
- Keyword-based requests for calendar, tasks, meetings, enrollment, sales,
  staffing or expense views. English and Malayalam text/meeting notes round-trip.
- Personal staff tasks/calendar; campus views for authorized managers.
- Structured task creation and meeting recording with linked action items.
- Calendar drafts, outbound drafts and payment simulations with separate review.
- Enrollment, sales, staff-hours and expense records in dashboard cards.
- Pending/approved/rejected/completed workflow with 24-hour approval expiry,
  exact payload digests and idempotent local execution.
- Server-owned identity/roles, tenant isolation, audit metadata, token revocation,
  retention policy changes requiring a different administrator's approval.

The assistant is an explicitly **deterministic bilingual briefing engine**, not
an LLM conversation agent. Unknown questions return the authorized briefing;
action submission always uses explicit fields. There is no speech input/output,
automatic meeting transcription, semantic extraction or live provider access.
The complete desk is English; report labels and responses support Malayalam.

## Review walkthrough

1. Connect as manager; inspect synthetic dashboards. Ask `ചെലവ്` in Malayalam
   to request the expense view. Lock the desk before switching identities.
2. Record a meeting, add action item titles on separate lines, and inspect tasks.
3. Draft a calendar event with timezone-aware start/end and attendee lines.
4. In the reviewer window, review exact content and approve. Self-approval fails.
5. Return to manager and execute. Result clearly says mock; no invitation is sent.
6. Connect as admissions: expense and staffing access is denied by the server.
7. Load audit trail as manager; it contains metadata, never the message body.

See [architecture and permissions](docs/ARCHITECTURE.md),
[deployment and retention](docs/DEPLOYMENT.md), [API](docs/API.md),
[access requirements](docs/ACCESS.md) and [verification](docs/TESTING.md).
