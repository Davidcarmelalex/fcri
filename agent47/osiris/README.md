# AGENT47 × OSIRIS research integration

Upstream: https://github.com/simplifaisoul/osiris
Documentation: https://osirisai.live/docs

**Status: architecture and 64 proposed deny-by-default skills. No API or MCP connection has been deployed.**

## Deployment approach
- Run OSIRIS as a separately pinned, reviewed container on Ubuntu.
- Do not expose its unauthenticated public endpoints or active RECON functionality directly on the AGENT47 management network.
- Route read-only, audited calls through a server-side AGENT47 adapter with strict host allowlisting, response-size limits, timeouts, caching, rate limits, and provenance.
- Verify each caller's Telegram ID, tenant, role and explicit skill grant *before* any upstream call.
- Treat public feeds as incomplete, stale or inaccurate unless corroborated.
- Restrict active scans to explicitly authorized infrastructure; disable active RECON for college demonstrations.
- Protect AI model keys server-side; do not paste them into shared browser consoles, chats or URLs.
- OI forecasting is a simulation, not an independently validated predictive oracle. Label assumptions, scenarios, costs and confidence limitations.
- OSIRIS's public documentation says many API routes require no authentication; put the self-hosted instance behind authenticated network access.
- Audit licenses of map tiles, third-party datasets and imagery independently of repository's MIT license.

## Integration plan
1. Pin and audit upstream release and transitive dependencies.
2. Verify documented endpoints against actual implementation and response schemas.
3. Add controlled adapters for /api/health, /api/stats, /api/earthquakes and /api/cyber-threats.
4. Validate cached feed freshness, attribution, redaction and safe display.
5. Build a read-only seminar dashboard with simulated fallback mode.
6. Connect OI MCP via a server-side permissioned proxy only after explicit evaluation.
7. Add per-user audit logs, rate limits, resilience tests and forecast cost approvals.

These skills are specifications only, not working integrations.
