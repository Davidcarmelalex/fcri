# Installation, deployment and retention

## Local review

Follow the project README. Python 3.11+ includes all dependencies. The server
binds only `127.0.0.1`; use synthetic demo data and per-user token files. Never
reuse the real management tenant for the seed fixture. No deployment, remote
services or live agent fleet is configured automatically.

## Shared pilot deployment checklist

This is a local prototype, not a completed production deployment. Before any
real management records are loaded, the deployment owner must:

1. Replace local user provisioning/token-file login with organization SSO/MFA
   and verified tenant/group mappings, retaining server-side authorization.
2. Replace the development HTTP serving layer with a maintained production
   gateway/ASGI service and configure TLS, HSTS, request limits, worker limits,
   CSRF defenses if cookie-based auth is introduced, and organization access.
3. Run under an unprivileged service account. Restrict database/WAL/token and
   backup paths to that account; use encrypted disks and approved backup keys.
4. Use PostgreSQL RLS or per-tenant databases for stronger isolation requirements;
   introduce schema migrations and audited role administration.
5. Export metadata audits to an independently controlled append-only destination.
   Monitor failed auth, denied actions, approval backlog and retention failures
   without recording payloads or credentials.
6. Set up the retention job, verify deletion and backup expiry, and test restore.
7. Implement only verified connectors with a test tenant. Add provider contract,
   outbox, retry, reconciliation and tenant-credential isolation tests.
8. Complete a security review and approve the data handling/retention policy.

Do not expose this Python development HTTP server directly to the internet.
The application has no payment/messaging/calendar provider clients and cannot be
switched into live mode by changing an environment variable.

## Retention

Each tenant starts with 30-day content retention and 365-day audit retention.
An admin proposes `retention.set`; a **different admin** reviews exact values;
the requester executes. The valid range is 1–3650 days. These are prototype
defaults, not a statement of AIBI's legal requirements.

Schedule the following once daily for **each provisioned tenant** using the host's
approved scheduler (Windows Task Scheduler or systemd timer):

```sh
python -m aibi --db /srv/aibi/runtime/aibi.sqlite purge --tenant YOUR_TENANT_ID
```

Purge removes content/actions older than the tenant content window, expired
credentials and metadata older than the audit window. It records a purge event.
Normal record reads already hide expired rows. Pending proposals also expire
after 24 hours. Audit actor IDs and object IDs are metadata with their own window.
SQLite physical pages/WAL and encrypted backups may retain old bytes: use the
storage provider's secure disposal, checkpoint/vacuum maintenance and backup
expiry policy. Logical delete is not cryptographic erasure. A restoration must
reapply purge policies before serving users. Legal holds and per-record erasure
are not implemented; decide those requirements before real data ingestion.

## Recovery and rollback

Take consistent SQLite backups via the SQLite backup API during a maintenance
window or approved backup agent, including correct WAL handling. Restrict and
encrypt backups, test restore into an isolated instance and revoke/reissue user
credentials after a suspected compromise. Stop the service before replacing the
database. This feature adds a standalone directory and CI workflow; rollback is
stopping its service and reverting the feature PR. Main FCRI site has no runtime
dependency on this service.
