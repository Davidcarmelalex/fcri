# AGENT47 security requirements

MVP: deny by default via Telegram numeric user-ID allowlist; never commit credentials; no external write tools; no access to AIBI data without written authorization. Treat Telegram messages as untrusted input. Do not assume Telegram messages provide end-to-end encryption for bot chats.

Before production: verify Telegram webhook signatures or secure polling host; implement tenant-scoped RBAC, encrypted credential vault, data minimization, retention limits, audit event store, rate limits, idempotency, explicit approvals with expiry and dual control for high-value payments, prompt-injection defenses, and incident response. Restrict agents to least-privilege tool access; require human approval for staff actions, payment execution, bulk outbound messaging, credential changes, deployment and destructive commands. Benchmark with FAASI Core and run security review.
