# AZRAEL adapter — FCRI canonical repository

Uses the reusable skill at `engineering-factory/shared/skills/autonomous-engineering-factory/SKILL.md`. This adapter does not change or duplicate AZRAEL's existing product roadmap, architectural docs or Codex task definitions.

## Identity and architecture

- **Canonical source:** private `Davidcarmelalex/fcri`, AZRAEL under `azrael/`, engineering factory under `engineering-factory/`. Inspected baseline: `caad6a4` on `codex/az-001-package` (2026-11-02). The distinct `ProjectAzrael/Azrael` repository is not substituted for this source.
- **Vision:** authorized, auditable, defensive cyber investigation and case-assistance system for Kerala Police evaluation; no claim of procurement, official adoption or live government integration.
- **Platforms:** Python `azrael_core` package and synthetic citizen-case/voice demos; FCRI monorepo contains web/Next.js components. Mobile, air-gapped deployment and official connectors remain to be independently verified.
- **Canonical docs:** `azrael/ROADMAP.md`, `engineering-factory/README.md`, `engineering-factory/tasks/`, `SECURITY.md`, `azrael/azrael-core/tests/`. Keep these authoritative rather than copying them.
- **Domain extensions (not generic skill requirements):** isolated critic/veto and HITL, forensic chain of custody, Proof-of-Justice Fabric, legally reviewed BSA certificate workflows, sovereign Malayalam NLP, scoped threat intelligence, sandboxed malware analysis, defensive SOC, explicitly approved Kerala Police connectors, air-gapped operation, honest live-engineering visualization, and synthetic demonstration readiness. Each is **unverified** until linked to test and authorization evidence.
- **Existing state:** source includes synthetic demos, voice/case continuity work and tests. Open FCRI PR chain includes #7–#13; PR #8 targets an engineering branch rather than `main`. No assertion of integrated production readiness. Current working tree had pre-existing manifest line-ending changes and generated caches; preserved by separate worktree.

## Authorization and roles

- Allowed: inspect owned repo/VPS, edit bounded documentation or code in isolated branch, run non-intrusive local tests, propose draft PR and review.
- Not allowed without specific approval: production deploy, active scanning, malware execution outside isolated approved lab, unauthorized collection, takedown, account freezing, real police connector use, credential disclosure, legal filings or issuance of BSA certificates.
- Never describe synthetic data as a real investigation. Any BSA certificate template requires qualified legal review; court admissibility cannot be self-certified.
- **Actual roles:** Hermes profiles `default`, `azraelsecurity`, `azraelux` were observed on the server, but independently running parallel agents for this change were not established. This run's implementer and verifier are sequential unless CI or a distinct reviewer independently confirms.
- **Supervisor:** independent reviewer with veto authority, not the code author. Required for every PASS and for any merge or public demonstration claim. Escalate unresolved approval/authorization and quota walls.
- **Resource policy:** bounded dispatch, no quota bypass, no uncontrolled retry, no concurrent edits to the same worktree. Use explicit budgets and rate-limit cooldowns.

## Skills and accountability matrix

| Capability | Available profile/tool | This change's execution | Independent approval |
| --- | --- | --- | --- |
| Product architecture / coordination | Hermes `default` profile exists | Sequential audit and adapter authoring | Required |
| Security, privacy, critic/veto | Hermes `azraelsecurity` profile exists | No independent security worker executed in this change | Separate security reviewer required |
| UX, accessibility, Malayalam | Hermes `azraelux` profile exists | No UX worker executed in this change | Separate accessibility/language evaluation required |
| Repository engineering and QA | Git + local Python; GitHub Actions | Local implementation, tests; hosted CI executed on PR | CI is independent execution, not human code review |
| Release, legal and police integrations | No approved integration or reviewer established | Not attempted | Authorized owner, security and legal reviewers required |

## Acceptance and roadmap

| Gate | Weight | AZRAEL acceptance |
| --- | ---: | --- |
| M0 Discovery | 10 | FCRI source SHA, existing work, PR/CI inventory, ownership and risks independently checked |
| M1 Foundations | 15 | Reproducible AZRAEL test collection, dependency lock strategy and dedicated CI |
| M2 Vertical slice | 20 | Deterministic synthetic citizen intake → case → policy decision → custody/export, with negative paths |
| M3 Agents | 10 | Approval-bound tools, independent critic/veto, replay audit and bounded dispatcher |
| M4 Integrations | 10 | Explicitly authorized provider contracts, mocks, license/secret review; police connectors remain gated |
| M5 UX | 10 | Presenter workflow, accessibility, Malayalam evaluation, honest live/replay labels |
| M6 Security | 15 | Isolation, custody integrity, privacy, abuse tests, resilience and offline fallback |
| M7 Packaging | 5 | Signed/reproducible staging artifact, install and rollback rehearsal |
| M8 Independent readiness | 5 | Independent evidence audit, presenter rehearsal and authorized release/demo signoff |

M0 → M1 → M2 are prerequisites for claiming a working vertical slice. The v2 ledger declares M3–M6 as parallel sibling gates after M1, M7 dependent on M2–M6, and M8 dependent on M7. A phase cannot PASS with a blocked prerequisite. No automatic exception or bypass exists. **Gate weights measure verified engineering acceptance, not product feature completion.** Current evidence ledger: `engineering-factory/adapters/azrael-gates.json` (schema v2, 22 weighted checks). Each PASS check requires structured source/test evidence and a distinct reviewer; each phase PASS also needs independent supervisor signoff. Initial statuses remain BLOCKED pending independent decisions. No readiness percentage is inferred from local or hosted CI alone.

## Verification and demonstration

- Python baseline: `python -m pytest -q azrael/azrael-core/tests` with dependency/environment recorded.
- Factory ledger: `python3 engineering-factory/shared/skills/autonomous-engineering-factory/verify_factory.py engineering-factory/adapters/azrael-gates.json`.
- GitHub PR CI and branch protection must be verified, not assumed from repository files.
- November 4 presentation: one safe, reproducible, synthetic scenario with explicit LOCAL/SYNTHETIC/PLAN labels; offline rehearsal; visible critic veto, consent and custody checks where implemented and tested. No real-world response action.
- Next: independently review M0 evidence, stabilize package/test and CI on the canonical FCRI branch, then deliver M2 synthetic end-to-end slice. Separate owners and approval required before any real integration.

## Risk register

| ID | Risk | Severity | Mitigation / gate |
| --- | --- | --- | --- |
| AZ-R1 | Multiple AZRAEL repositories and stacked PR bases cause provenance confusion | High | FCRI canonical, exact SHA and PR base in each report; M0/M1 |
| AZ-R2 | Tests or CI absent on current branch; demo claims exceed evidence | High | Run local tests, hosted CI, independent review, capability labels; M1/M8 |
| AZ-R3 | Unauthorized live defensive action or evidence collection | Critical | Synthetic-only, least privilege, HITL and independent veto; M3/M6 |
| AZ-R4 | Forensic or BSA admissibility overstated | High | Hash/audit tests and qualified legal review before any certificate claim; M4/M6 |
| AZ-R5 | Worker quota/rate limits and shared worktree conflicts | Medium | Cooldown, bounded jobs, isolated worktrees, no automatic gate bypass; M0/M3 |
| AZ-R6 | Malayalam, accessibility, offline and integrations untested | High | Separate evaluations and rehearsal, label PLAN until verified; M4/M5/M7 |
| AZ-R7 | Python dependency versions are not fully pinned | Medium | Lock and audit dependency graph before M1 PASS |
| AZ-R8 | Evidence/approval strings can be forged or self-reviewed | High | v2 structured evidence, separate reviewer identities, independent GitHub review and source verification; M0/M8 |
| AZ-R9 | Backdated approvals or mixed source revisions can inflate weighted verified readiness | High | Enforce chronological review/phase decisions and single-revision PASS evidence; independently verify external evidence; M1/M8 |
| AZ-R11 | Gate approvals could ignore blocked prerequisite phases and misstate release readiness | High | Enforce explicit DAG prerequisites and reject PASS on blocked dependencies; M1/M8 |
| AZ-R10 | Canonical FCRI main branch lacks verified branch protection | High | GitHub branch protection API returned HTTP 404 (2026-11-02); require admin-configured review and CI gates before M1-C3 PASS; M1/M8 |
