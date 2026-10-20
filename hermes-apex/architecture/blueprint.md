# HERMES APEX Architecture v1

## Command and divisions
PRIME delegates tasks and compiles results. Eight division leads:
SCHOLAR (ORACLE, AXIOM, QUANTUM, SCRIPTOR, PEDAGOG, BIBLION);
SENTINEL (JUSTITIA, FORENSIX, ARGUS, EVIDENCE, REGULUS, VERDICT);
FORGE (ARCHITECT, CODEX, MOBILE, CIPHER, DEPLOY, NEURAL);
LEDGER (QUANT, TREASURY, VALOR, RISK, CAPITAL, AUDITOR);
SIGNAL (EDITOR, VISUAL, CINEMA, VOX, PRESS, PUBLISHER);
NEXUS (DIPLOMAT, CAMPUS, MARKET, VENTURE, GRANTS, GLOBAL);
CIVITAS (GOVERNOR, ETHOS, POLICY, IMPACT, PEOPLE, TRUST);
ATLAS (CHIEF, MEMORY, TEMPO, LOGISTICS, AUTOMATA, INSIGHT).

Independent assurance: SKEPTIC, FACTCHECK, REDTEAM, SECURITY, PRIVACY, CITATION, REPRODUCE, LEGAL-QA, FINANCE-QA, EDITOR-QA, RELIABILITY, EVALUATOR.

## Execution protocol
1. Authenticate requester and authorize mission scope.
2. PRIME decomposes into bounded tasks with assigned roles and budgets.
3. Worker retrieves only authorized project data and tool capabilities.
4. Worker produces artifacts, provenance and confidence/uncertainty.
5. Independent QA checks evidence, policy, security and correctness.
6. Consequential actions await explicit human approval.
7. Immutable audit event records outcome; memory updates are versioned.

## Task schema
task_id, project_id, role_id, objective, input_refs, allowed_tools, data_classification, cost_limit, deadline, deliverables, review_requirements, approval_state, status, attempts, artifact_refs, audit_refs.

## Proposed infrastructure (not installed)
Hermes runtime adapter; Python orchestration; PostgreSQL + pgvector; durable job queue; S3-compatible encrypted artifact store; container sandbox; OTel traces; GitHub CI; secrets manager; approval UI.

## Skill quality
Each SKILL.md contains activation triggers, procedure, permitted tools, input/output schema, failure modes and evaluation tests. Changes require peer review and regression tests.

## Phases
P0: version/compatibility discovery, security model and tests.
P1: PRIME + SCHOLAR + SENTINEL + FORGE + LEDGER, dry-run only.
P2: memory, delegation, task queue, QA and approval interface.
P3: other divisions and specialist roles.
P4: independent assurance network, benchmark suite and production rollout.

## Acceptance targets (aspirational, not measured)
100% gated high-impact actions; 100% source traceability for material claims; >=90% critical-path test coverage; >=95% completion on a fixed authorized benchmark. Report actual results, not assumed scores.
