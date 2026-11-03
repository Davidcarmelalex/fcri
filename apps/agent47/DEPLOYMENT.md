# Ubuntu deployment

## Requirements
Ubuntu 22.04 or 24.04, Docker Engine + Compose plugin, Git, Python 3, and at least 1 GiB free RAM. Use a dedicated non-root administrative account. Install Docker from the official documentation and verify `docker compose version`.

## Deploy the reviewed branch

```bash
git clone --branch feature/agent47-foundation https://github.com/Davidcarmelalex/fcri.git
cd fcri/apps/agent47
bash install-ubuntu.sh
curl -fsS http://127.0.0.1:8747/health
```

Open `http://127.0.0.1:8747/` locally. For remote access, use SSH tunneling:

```bash
ssh -L 8747:127.0.0.1:8747 youruser@your-server
```

Then visit `http://127.0.0.1:8747/` on your computer. Retrieve the secret from `.env` on the server. Never paste it into chats, screenshots, or public repositories.

## Updates and recovery

```bash
git pull --ff-only
cd apps/agent47
docker compose up -d --build
docker compose logs --tail=100
```

No durable state is stored in this foundation. Future releases with persistent storage require a migration and backup plan. Do not grant directors access to this shared-key prototype. For production use, implement OIDC/MFA, authorization, per-user audit logs, rate limiting, and TLS.
