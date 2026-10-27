# AZRAEL Build World

An original pixel-art dashboard hosted on the AZRAEL server. No Nintendo assets,
external fonts, frontend libraries, build step, or npm dependencies are used.

## Run

Requires Node.js 22 or newer. From this directory:

```sh
node --test test/*.test.mjs
node server.mjs
```

Open http://127.0.0.1:3088. Change HOST and PORT through environment variables.
The public page is read-only. There is no browser command or deployment endpoint.

## Live data

The browser polls the server every 10 seconds while visible. The server caches
public GitHub pull requests, AZRAEL-path commits, and workflow runs for 60 seconds.
Counters cover up to the latest 40 repository PRs filtered by AZRAEL/AZ-00 title,
not lifetime totals. Checks cover AZRAEL workflow runs among the last 30 runs.
GitHub failures are shown as delayed data. Do not interpret unknown checks as passing.
An optional server-only GITHUB_TOKEN raises API limits; never expose it to clients.

Agents report their actual work using:

```sh
AZRAEL_ACTIVITY_FILE=/var/lib/azrael-build-world/activity.jsonl \
node /srv/azrael-build-world/report.mjs \
  --agent builder --status building --task 'Implementing approval validation' \
  --detail 'Public summary only; no logs, credentials, or incident data.'
```

Roles: builder, architect, sentinel, courier. Statuses: building, testing,
reviewing, blocked, idle, done. Report every 30–60 seconds while work is active,
then report done/idle. Fresh indicators expire after 90 seconds. Ensure the
app service can read the activity file; it is a public-status feed, not a log sink.
Map roles to real agents explicitly; this page does not launch agents.

The optional observer watches only Git status and modification times under
`azrael/` in the configured server checkout. It reports recent file changes,
clearly labeled as workspace observations, not agent task transcripts. It never
reads Codex conversations or executes the core. An unchanged workspace goes idle.
Its bounded public feed is trimmed to about 500 records above 1 MiB.

Ambient animation is illustrative. Explore demo is explicitly labeled and has
no effect on real data or the server. Pause, day/night, and agent selection are
client-only. Reduced-motion preferences are respected.

## Deployment on 72.61.113.232

The supplied systemd units use this server's existing Node runtime at
`/srv/agentrunme/runtime/node-v24.22.1/bin/node`; change ExecStart on other hosts.
Install application files under `/srv/azrael-build-world`, create the unprivileged
system user `azrael-world`, and install the units from `deploy/` into
`/etc/systemd/system/`. The observer requires read access to the checkout and
runs separately from the unprivileged web service.

The service binds only to 127.0.0.1:3088. Add `deploy/nginx-location.conf` inside
the existing HTTP/HTTPS server blocks, test the complete active Nginx config,
and reload the existing master without replacing the other site routes.

```sh
systemctl daemon-reload
systemctl enable --now azrael-build-world azrael-build-observer
curl --fail http://127.0.0.1:3088/healthz
curl --fail http://127.0.0.1:3088/api/world
```

Use `/azrael-world/` through the existing proxy. Verify the original site still
responds. Keep a backup of the original proxy configuration before modifying it.
Rollback: remove the added location include, test/reload Nginx, and stop/disable
the two AZRAEL units. Existing application services are independent.
