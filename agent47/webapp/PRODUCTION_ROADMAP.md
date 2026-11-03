# AGENT47 RED COMMAND — production quality gates

## What exists
- Static 2D tactical dashboard (index.html)
- Static 3D Cesium prototype (command-center.html)
- Seminar launchpad (launch.html)
- Read-only public USGS earthquake feed and synthetic demonstration fallback

**No OSIRIS API, God's Eye View application, agent voice, SSO, RBAC, data warehouse or executive systems are connected to the webapp.** This is not production ready.

## Required before public college launch
1. Test CesiumJS version 1.127 and its CDN in Chrome/Firefox/mobile; verify the Cesium widget assets and OpenStreetMap imagery attribution and usage limits. Use a bundled/self-hosted build for reliability.
2. Add offline rehearsals, cached demonstration datasets and a provider-compliant tile service.
3. Add strict CSP, SRI or self-hosted dependencies, accessibility tests, error reporting and end-to-end browser tests.
4. Add authenticated server-side gateway for OSIRIS feeds, API keys and tenant-scoped permissions.
5. Review OSIRIS and God's Eye View licenses, providers, data quality and commercial use terms; pin upstream commits.
6. Implement voice with microphone consent, server-side transcription, Malayalam TTS, per-user limits and explicit cost controls.
7. Provide admin/director SSO, RBAC, audit logs and human approval for any write action.
8. Implement citations, feed timestamps, provenance and synthetic-data indicators on all research modules.
9. Add staging deployment, health checks, backups, uptime alerts and load tests.
10. Never present simulated intelligence, stale data or model forecasts as verified live facts.

## Hosting
Serve this folder as a static site over HTTPS. `python3 -m http.server 8080` is only for local development and should not be used as a public production server. The Telegram bot's Docker Compose configuration does not serve these HTML files.
