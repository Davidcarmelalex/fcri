# AGENT 47 — Release milestones

Status: development branch. Completion means passing acceptance tests, not simply committing source files.

## M0 — Foundation (implemented; verification pending)
- [x] API skeleton, initial dashboard, brand assets, Docker Compose
- [x] Initial CLI, model adapter, SQLite memory, explicit task endpoints
- [ ] Clean Ubuntu install and smoke test
- [ ] CI green, security review and dependency pinning

## M1 — Reliable single-agent runtime
- [ ] Config validation and provider compatibility tests with mocked API
- [ ] Streaming output, bounded context, error classification, retries
- [ ] Per-session isolation and persistence/recovery tests
- [ ] CLI and web chat end-to-end tests
**Exit:** Fresh install, configure a provider, complete 20 scripted tasks with no uncaught errors.

## M2 — Versioned skills and safe tools
- [x] Read-only skill manifest catalog with explicit schema and validation
- [ ] Sandboxed file read/write skill and workspace confinement tests
- [ ] Tool policy enforcement and human approval for side effects
- [ ] Skill package signatures, provenance and update mechanism
**Exit:** Install and run 5 reviewed skills without unauthorized file/network access.

## M3 — Durable orchestration
- [ ] Worker queue, leases, retries and crash recovery
- [ ] Delegation protocol and task DAGs
- [ ] Scheduled tasks with cancellation and resource budgets
- [ ] Audit events for every execution and approval
**Exit:** Recover interrupted tasks and pass concurrent task stress tests.

## M4 — Multi-user command center
- [ ] OIDC SSO and MFA
- [ ] Director-specific roles, tenant boundaries, audit search
- [ ] Interactive task graph, monitoring, notifications
- [ ] Accessible responsive interface and seminar demo mode
**Exit:** Security tests show users cannot access other users' sessions or tasks.

## M5 — Integration ecosystem
- [ ] Verify Hermes integration API and license compatibility
- [ ] GitHub, approved research sources and geospatial adapters
- [ ] Browser automation with isolation and permission gating
- [ ] Connector secrets and scoped credentials
**Exit:** 3 real integrations pass isolated integration tests.

## M6 — Public release / Ubuntu operations
- [ ] Pinned dependencies, SBOM, license inventory, vulnerability scan
- [ ] Signed tagged release and reproducible builds
- [ ] Clean Ubuntu 22.04/24.04 installation tests
- [ ] Backups, restore drills, upgrade and rollback procedures
- [ ] Contributor guide, tutorials, API docs, security policy
**Exit:** Independent reviewer installs, upgrades and restores Agent 47 from docs.

## Definition of done
No milestone is marked complete solely because code was pushed. Require CI, manual validation, security review, documentation and acceptance evidence.
