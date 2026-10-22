# AGENT47 Master Skill Registry

The 192 entries in master-registry.json are **capability specifications**, not implemented skills.

Every skill starts with `status: specification_only` and `default_access: deny`. Granting a skill to a principal does not make it executable. A reviewed, read-only adapter must exist, and the entry must explicitly be promoted to `implemented` after tests and approval.

Authorization requires: verified Telegram user ID mapped to an active principal, matching tenant, explicit per-skill grant, implemented skill status, and side effects disabled.

**Production requirements still outstanding:** durable identity store, enrollment proof, revocation, cryptographically attributable audit trail, role-specific data-level permissions, approval engine, retention policy, service authentication, rate limits, secure secrets and integration tests. Do not assign director access by telephone number alone.

Run offline tests: `python -m unittest discover -s agent47/tests -v` from the repository root.
