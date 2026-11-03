# Verification · 2026-10-22

Local Windows verification with the bundled Python runtime:

```sh
python -m unittest discover -s tests -v
python -m compileall -q aibi
node --check aibi/web/app.js
git diff --check
```

23 tests passed. Coverage includes:

- Tenant separation for records, action IDs, queue visibility and retention.
- Role restrictions on expense reads, financial proposals and staff assignment.
- Personal staff task visibility and cross-tenant assignee denial.
- Different-user approval, exact digest binding, rejection, approval expiry.
- Revoked approver and demoted requester denied at execution time.
- Tampered stored payload denied; replacement execution body rejected.
- Durable approval state, proposal idempotency and conflicting key detection.
- Concurrent duplicate execution creates exactly one local calendar record.
- Expired/revoked credentials and server-only tenant/role resolution.
- Currency amount validation and timezone-aware event validation.
- Agent47 raw command dispatch and cross-user history disabled.
- Meeting notes and linked action items; Malayalam text round-trip.
- Role-filtered bilingual briefings and topic-specific HTTP responses.
- Denial audit persistence, hashed token storage, static file allowlist and CSP.

The initial test attempt could not open SQLite databases in the Windows sandbox
temporary directory. Fixtures now use a temporary subdirectory of ignored
project `runtime/`; the complete suite then passed. Upstream vendored Agent47
emits a `datetime.utcnow` deprecation warning on recent Python versions; its
pinned source was preserved with only trailing whitespace normalized.

CLI provisioning and synthetic seeding succeeded. Local HTTP service starts and
the browser login page was visually inspected. Authenticated HTTP workflows were
tested programmatically; authenticated browser end-to-end interactions were not
verified. JavaScript syntax and Python compilation passed.

Not tested: live AIBI connectors, live model inference, provider delivery,
SSO/MFA, production deployment, load/concurrency beyond the local transaction
test, backup restore or independent security penetration testing. No real
campus data was used. GitHub CI results must be checked on the PR; local results
do not imply that remote CI has run.
