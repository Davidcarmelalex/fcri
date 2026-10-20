# HERMES APEX — FCRI Agent Ecosystem

Status: architecture specification (not deployed). Parent repository: FCRI.

## Mission
An auditable, human-governed multi-agent platform supporting FCRI academic research, legal and corporate research, software, publishing, finance, institutional operations and partnerships.

## Organization
- PRIME: central planning and delegation.
- SCHOLAR: academic research.
- SENTINEL: authorized investigations and legal research.
- FORGE: engineering.
- LEDGER: financial modeling.
- SIGNAL: media and publishing.
- NEXUS: growth and institutional partnerships.
- CIVITAS: governance.
- ATLAS: executive operations.
- 48 specialists (six under each division) and 12 independent assurance roles. Total: 69 logical roles (1 PRIME + 8 division leads + 48 specialists + 12 assurance).
- Roles are instantiated on demand; they are not always-on processes.

## Initial MVP
PRIME, SCHOLAR, SENTINEL, FORGE, LEDGER. The other roles are future scope.

## Layout
- architecture/: system design and roadmap
- agents/: versioned role manifests
- skills/: portable SKILL.md packages
- policies/: tool permissions and approval gates
- deployment/: Ubuntu operational guidance

## Non-goals
No unreviewed publication, financial transfers, court filings, unrestricted surveillance, privilege escalation, or self-modifying production policies.

## Read first
See architecture/blueprint.md and policies/SECURITY.md. Before deployment, validate Hermes runtime version and its actual tool/skill integration APIs; this repository does not claim native Hermes support for orchestration features.
