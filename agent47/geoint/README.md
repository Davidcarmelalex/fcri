# AGENT47 GEOINT (integration design)

Upstream: https://github.com/bilawalsidhu/gods-eye-view

**Status: design + 52 deny-by-default skill specifications. Not deployed or connected to Telegram.**

God's Eye View is an independently maintained web application. Keep it in a separately deployed, loopback-only container; do not directly expose its local provider settings or privileged endpoints on a public server.

## Integration architecture
- AGENT47 handles verified Telegram identity, tenant authorization, skill permission and source-aware response synthesis.
- An isolated GEOINT adapter accesses only audited, read-only public datasets or documented service APIs.
- God's Eye View provides browser-based interactive visualization; use signed, short-lived access via an authenticated reverse proxy if multiuser access is required.
- Never assume a voice/UI command in the upstream app is an authenticated remote API.
- Record provider, timestamp, coverage, confidence and license for every research finding.
- No tracking of private individuals, private camera access, stalking, or covert surveillance.

## Engineering checklist
1. Pin and review an upstream release/commit, LICENSE, DATA_SOURCES.md, THIRD_PARTY_NOTICES.md, SECURITY.md and Docker configuration.
2. Audit endpoints and identify stable, documented integration surfaces. Do not scrape private interfaces or expose secrets.
3. Validate provider terms, quotas and commercial permissions, especially imagery, 3D tiles and bundled scenes.
4. Run GEV as a separate service bound to 127.0.0.1 and protect any browser access with SSO/reverse proxy.
5. Implement provider adapters, schema validation, caching, provenance and data freshness checks.
6. Connect only explicitly approved read-only skills through AGENT47's real authorization engine.
7. Test tenant isolation, voice responses, stale-data warnings, performance and failure modes.
8. Treat all feed coverage as incomplete and never claim live satellite imaging or privileged intelligence access.

This directory does not install or vendor upstream code. No integration is live.
