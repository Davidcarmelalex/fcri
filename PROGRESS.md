# FCRI Progress

Date: 2026-04-02 UTC

## Estimated Completion

- Overall completion: 96%
- Site/content surface: 94%
- Operational deployment readiness: 96%
- Public release readiness: 94%

## Current Stage

FCRI is now deployed on the Debian production VPS at `187.124.98.170` behind Nginx with HTTPS enabled for `fcri.science`. The site is materially past pre-launch and is in release-hardening mode rather than raw build-out.

## Confirmed Progress

- Active repo path is `/root/projects-core/fcri`.
- Production build succeeds with `npm run build` on 2026-04-02.
- Repo lint passes with `npm run lint` on 2026-04-02.
- The app currently renders a large route surface spanning institute overview, research, academics, ecosystem, support, media, and intake flows.
- Deployment configuration exists under `deploy/`.
- Operations and content model documentation already exist.
- Deployment model is now aligned to a real Next.js server runtime so inquiry submission can work in production.
- Course and fellowship routes now submit structured intake requests instead of placeholder content.
- Production deployment has been executed on `187.124.98.170`.
- `fcri-web.service` is active under systemd on the production host.
- Nginx is active on the production host and serves the app successfully.
- HTTPS is active for `https://fcri.science`.
- Public inquiry submission has been verified live against `https://fcri.science/api/inquiries`.
- Public EVM treasury wallet references are now published across the support surface using `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`.

## Working Baseline

- Core institutional information architecture is present.
- Research and academic sections are already scaffolded into dedicated routes.
- Contact/intake handling exists through `/api/inquiries`.
- Metadata is already aligned to `https://fcri.science`.
- Live host-header and public HTTPS smoke tests have passed on the production VPS.

## Remaining Gaps

- SMTP credentials are still not configured, so inquiry emails are stored but notifications are not delivered.
- Final editorial consistency and route-by-route polish still need a release review pass.
- Ongoing content, governance, and institutional copy refinement can continue after launch.

## What Is Left

- Configure production SMTP so inquiry acknowledgments and internal notifications are delivered.
- Do a final editorial and UX QA pass across public routes.
- Add ongoing monitoring and operational alerting if you want stricter release discipline.

## Build / Repo Snapshot

- Git state: synced to GitHub on 2026-04-02
- GitHub repo: `Davidcarmelalex/fcri`
- Frontend build: passing
- Production deployment: active on `187.124.98.170`
- Domain deployment: live on `fcri.science`
- HTTPS status: active
- Live intake API: verified
- Active EVM treasury wallet: `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`

## Practical Assessment

FCRI is now effectively live. The main remaining work is SMTP enablement and final polish, not baseline deployment.

## Next Actions

1. Configure SMTP credentials and validate real email delivery.
2. Run a route-by-route editorial and UX polish pass.
3. Add release monitoring and backup discipline if desired.
