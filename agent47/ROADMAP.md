# AGENT47 RED COMMAND — Delivery Roadmap

Status: active development, not production ready. Branch: feature/agent47-command-center.

## Definition of done (all milestones)
- Source committed and reviewed, with no credentials in Git
- Automated tests passing in CI
- Integration tested in an actual running environment
- Security and privacy review complete for the milestone
- Operational documentation, failure handling, rollback and acceptance evidence recorded

## 01 — Engineering foundation (2–4 engineering days)
- [x] Create milestone roadmap and acceptance matrix
- [x] Add GitHub Actions Python tests and static syntax validation
- [x] Add baseline webapp HTML link checks
- [ ] Run CI on GitHub and fix failures
- [ ] Pin and verify frontend libraries and provider usage
- [ ] Record tested runtime versions and integration test evidence
**Exit:** green CI, reproducible local test command, no known blocking errors.

## 02 — Unified Ubuntu deployment (3–5 days)
- [ ] Containerize static webapp and gateway with pinned versions
- [ ] Configure HTTPS, domain, auth boundaries, secure reverse proxy
- [ ] Health checks, restart, observability, backups and rollback
- [ ] Validate one-line assisted installation on clean Ubuntu
**Exit:** clean Ubuntu deployment and smoke test with rollback.

## 03 — Production GEOINT interface (5–8 days)
- [ ] Validate Cesium initialization, imagery attribution and event overlays
- [ ] Move USGS requests through the gateway
- [ ] Offline-ready seminar datasets and source/freshness badges
- [ ] Accessibility, mobile, large-display and load testing
**Exit:** demonstrated working 3D research scenes with reproducible evidence.

## 04 — OSIRIS intelligence (5–8 days)
- [ ] Pin and review OSIRIS upstream source and license
- [ ] Validate API routes and response schemas on isolated deployment
- [ ] Build allowlisted, read-only gateway adapters and caching
- [ ] Add provenance, freshness, citations and outage fallbacks
**Exit:** verified OSIRIS feed displayed with source timestamps.

## 05 — God's Eye View (5–8 days)
- [ ] Pin upstream revision and audit dependencies/data licenses
- [ ] Deploy isolated visualization service behind authentication
- [ ] Integrate verified, permitted public layers with AGENT47 research
- [ ] Test performance and provider limits
**Exit:** stable authorized geospatial demonstration without private tracking.

## 06 — Identity and permissions (5–8 days)
- [ ] Secure identity enrollment and founder/admin bootstrap
- [ ] FCRI/AIBI tenant isolation, role grants and revocation
- [ ] Enforce authorization at every data and tool boundary
- [ ] Audit logs, consent, session controls and approval workflow
**Exit:** denied cross-tenant access in automated and manual tests.

## 07 — AI and Malayalam voice (6–10 days)
- [ ] Scoped AI tool calling through enforced policy engine
- [ ] Browser voice with consent and no client-side API keys
- [ ] Malayalam/English ASR and TTS quality evaluation
- [ ] Citations, latency budgets, spend limits and failure handling
**Exit:** authorized spoken research query, verified data and spoken answer.

## 08 — Research agent orchestration (7–12 days)
- [ ] Implement selected skills rather than merely listing them
- [ ] Queue, timeout, retries, budget and task state
- [ ] Human approvals for writes and external side effects
- [ ] Evaluation harness for factuality, safety and provenance
**Exit:** audited end-to-end research task with source-cited export.

## 09 — Seminar experience (4–7 days)
- [ ] Guided scenario library and audience-safe mode
- [ ] Fullscreen speaker controls and preloaded rehearsal data
- [ ] Printable research brief and presenter notes
- [ ] Offline/degraded mode and university network rehearsal
**Exit:** successful full seminar rehearsal without privileged data.

## 10 — Security and release (7–12 days)
- [ ] Dependency and container scans, threat model and pentest
- [ ] Load tests, incident response, monitoring, backup/restore
- [ ] Accessibility, privacy, licensing and deployment sign-off
- [ ] Versioned release, production deployment and rollback exercise
**Exit:** signed-off release evidence and operational handover.

## Dependencies and sequencing
01 -> 02 -> 03 -> 04/05 -> 06 -> 07 -> 08 -> 09 -> 10.
Public data demos can progress before IAM, but no private director access or privileged agent execution may go live before milestone 06.

## Current truth
- Existing 2D and 3D frontends are prototypes, not browser-tested here.
- Gateway provides USGS read-only route and optional OSIRIS health check, not actual intelligence data integration.
- Skill registry definitions are not executable capabilities.
- Telegram voice prototype is not connected to webapp or authorization engine.
- No live VPS deployment has been verified.
- Rotate the previously disclosed Telegram bot token before deployment.
