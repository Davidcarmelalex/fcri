# Security and autonomy policy

Default deny. Per-role allowlists for tools, data scopes, network egress, compute and spending. No agent can change its own permissions, approval policy or audit history.

AUTO: read permitted sources, draft internal documents, run sandboxed tests and prepare internal reports.
REVIEW: public statements, outbound institutional communications, production deployments and official submissions.
EXPLICIT HUMAN AUTHORIZATION: money movement, investments, legal filings, access control changes, sensitive-data disclosures and irreversible operations.

No secrets in git. Use a secrets manager and short-lived tokens. Keep legal evidence and personal information in encrypted restricted storage. Avoid putting sensitive investigation materials in model prompts unless necessary and authorized. Do not publish unverified allegations. Cite sources and record provenance. Require authorized scope for security testing and public-record investigations.

Workers execute with non-root users, resource limits, isolated filesystems, timeouts and outbound network restrictions. Keep append-only audit records, incident response procedures, rollback plans and emergency stop. Red-team prompt injection, data exfiltration, excessive delegation and approval bypass.
