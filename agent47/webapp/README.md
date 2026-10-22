# AGENT47 GEOINT Seminar Web App

**Status:** Functional static-map MVP code; not yet deployed or browser-tested in this environment.

Open `index.html` in a modern browser, or serve locally with `python3 -m http.server 8080` from this directory and open `http://localhost:8080`.

## Capabilities
- FCRI-branded research interface
- Interactive OpenStreetMap/Leaflet world map
- USGS public earthquake feeds: day, week, month
- Selectable observations with UTC time, magnitude, reported depth and place
- Presentation mode, India/world view controls
- Clearly labeled illustrative demo dataset when offline or for rehearsal
- Source attribution and visible data freshness

## Deploy
Publish the directory via a static HTTPS host or place behind a secured reverse proxy on Ubuntu. Public read-only demo mode can be separated from authenticated AGENT47 command center. Review tile provider usage policy, traffic limits, CDN availability and institutional privacy requirements before large seminars.

## Next phases
1. Self-host frontend dependencies and controlled map tile provider for reliability.
2. Optional Cesium 3D globe and audited God's Eye View integration.
3. Backend data proxy/cache with provenance, quotas and freshness indicators.
4. Malayalam speech narration, seminar scripts and slide-linked scenarios.
5. Private director login, RBAC and research workspaces.

No secret API keys should be embedded in this static frontend. Do not claim the demo dataset is live.
