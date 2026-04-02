FCRI website handoff for Kilo Code

Project path
- /root/fcri-website

Primary objective
- Finish the FCRI website for production and get it live on the Debian server for the domain fcri.science.

Current confirmed state
- This is the primary codebase to use, not the old static site under /root/voltex/fcri/frontend.
- The app builds successfully with `npm run build`.
- The site is a Next.js app with static routes and production build artifacts already generated.
- Metadata in src/app/layout.tsx already references https://fcri.science.

Legacy deployment context
- There is an old nginx config at /etc/nginx/sites-available/fcri.liberland.org.
- There is an old static deployment at /var/www/fcri/index.html.
- That old config is not the target for go-live and should be treated as legacy unless explicitly reused as a migration base.

What needs to be done
- Review the current FCRI site for completeness and production readiness.
- Identify missing pages, content gaps, broken links, weak sections, or inconsistent design.
- Improve the site where needed.
- Prepare the Debian deployment path.
- Set up or update nginx for fcri.science.
- Ensure the app can be served reliably on Debian.
- Get the site publicly live if DNS and server access permit.

Deployment expectations
- Prefer a robust Debian-friendly deployment.
- If the site can be exported statically, a static nginx deployment is acceptable.
- If a Next.js server runtime is needed, set up a proper long-running service and nginx reverse proxy.
- SSL/TLS should be included if the domain resolves correctly.

Known blockers to verify
- Whether fcri.science DNS points to this Debian server.
- Whether an nginx site for fcri.science already exists.
- Whether certbot/SSL can be issued successfully.
- Whether static export or server mode is the better fit for this app.

Definition of done
- The best available FCRI site is built from this codebase.
- Debian deployment is configured cleanly.
- nginx is serving the correct site for fcri.science.
- If DNS is ready, the site is publicly reachable over HTTPS.
- Any remaining blockers are documented precisely.
