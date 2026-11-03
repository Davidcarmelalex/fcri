# Ubuntu deployment runbook — development preview

## Requirements
Ubuntu 22.04 or 24.04, Python 3, Git, Docker Engine and Docker Compose plugin, at least 1 GB available memory. Install Docker using the official Ubuntu documentation and verify `docker compose version`. Docker group membership grants root-equivalent host privileges; restrict it.

## Installation
```bash
git clone --branch feature/agent47-foundation https://github.com/Davidcarmelalex/fcri.git
cd fcri/apps/agent47
bash install-ubuntu.sh
bash smoke-test.sh
```

The installer generates a random shared API key in `.env` if absent and binds the web service to **127.0.0.1:8747 only**. It does not install Docker automatically.

## Configure AI
Edit `.env` with a trusted OpenAI-compatible provider's HTTPS URL, key and model identifier. Then:
```bash
docker compose up -d --build
bash smoke-test.sh
```
Open the dashboard locally on the Ubuntu machine or through an SSH tunnel:
```bash
ssh -L 8747:127.0.0.1:8747 USER@SERVER
```
Then visit http://127.0.0.1:8747 on your local browser.

## Operations
```bash
docker compose ps
docker compose logs --tail=100 agent47
docker compose restart agent47
docker compose down
```

## Data and backup
Conversation, task and workspace data live in the named Docker volume `agent47-data`. Back up the volume before upgrades and test restoring it on a separate host. `docker compose down -v` **deletes the data**.

## Limitations
This is a prototype, not a production multi-director service. Shared API-key authentication, no MFA/RBAC, no audited worker scheduler, no deployment-tested third-party skills. Do not open port 8747 to the public internet. Provider calls require outbound HTTPS and may send prompt contents to the configured model provider.
