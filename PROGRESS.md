# FCRI Progress

Date: 2026-04-02 UTC

## Estimated Completion

- Overall completion: 88%
- Site/content surface: 90%
- Operational deployment readiness: 78%
- Public release readiness: 80%

## Current Stage

FCRI has a broad, content-rich institutional site with a successful production build and a deployment model oriented toward static export behind Nginx. The site is substantially further along than a placeholder, but public go-live work is still blocked on deployment validation, domain cutover, and release discipline.

## Confirmed Progress

- Active repo path is `/root/projects-core/fcri`.
- Production build succeeds with `npm run build` on 2026-04-02.
- Repo lint passes with `npm run lint` on 2026-04-02.
- The app currently renders a large route surface spanning institute overview, research, academics, ecosystem, support, media, and intake flows.
- Deployment configuration exists under `deploy/`.
- Operations and content model documentation already exist.
- Deployment model is now aligned to a real Next.js server runtime so inquiry submission can work in production.

## Working Baseline

- Core institutional information architecture is present.
- Research and academic sections are already scaffolded into dedicated routes.
- Contact/intake handling exists through `/api/inquiries`.
- Metadata is already aligned to `https://fcri.science`.

## Remaining Gaps

- Git has not been initialized or attached to the intended remote in this migrated repo.
- Public deployment to `fcri.science` has not been validated in this update.
- DNS, Nginx activation, and TLS issuance still need operational confirmation.
- Content quality, editorial consistency, and route-by-route polish still need release review.

## What Is Left

- Decide the final deployment mode around `/api/inquiries`.
- Initialize Git or connect the repo to its intended remote.
- Do a route-by-route editorial and UX release pass.
- Validate Debian deployment, Nginx wiring, and target web root.
- Confirm DNS and HTTPS cutover for `fcri.science`.

## Build / Repo Snapshot

- Git state: uninitialized repo with all project files uncommitted
- Frontend build: passing
- Domain deployment: not validated in this update
- HTTPS status: not validated in this update

## Practical Assessment

FCRI is in a strong pre-launch website state. It appears materially closer to public release than VoltexBazar, provided deployment and domain operations are handled cleanly.

## Next Actions

1. Decide final deployment mode for the inquiry flow and confirm whether pure static export remains the right fit.
2. Initialize Git or attach the repo to its intended remote.
3. Review route quality and copy consistency before release.
4. Validate Debian deployment steps, Nginx config, and target web root.
5. Confirm DNS for `fcri.science` and complete HTTPS cutover.
