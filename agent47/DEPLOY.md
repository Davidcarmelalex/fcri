# AGENT47 Ubuntu deployment (pilot)

**Status:** Telegram executive AI pilot, not a complete autonomous enterprise system. AIBI/FCRI live systems, approval workflows, director enrollment, durable memory, and production audit infrastructure are not connected.

## Prerequisites
- Ubuntu 24.04 server, SSH key access, Docker Engine + Compose plugin installed using Docker's official Ubuntu documentation
- A **newly regenerated** BotFather token (never reuse the token previously posted in chat)
- OpenAI API key for conversation and voice features
- Your numeric Telegram user ID, obtained through a trusted ID bot or a locally inspected Telegram update; do not confuse this with a phone number

## One-line launch after prerequisites
```bash
git clone https://github.com/Davidcarmelalex/fcri.git --branch feature/agent47-command-center --single-branch && cd fcri/agent47 && bash bootstrap.sh
```
First run creates private `.env` and exits for secret configuration. Then:
```bash
nano .env
bash bootstrap.sh
```
Do not put credentials into shell history, chat, a Git commit, or a public URL. Restrict server SSH access and use provider firewall rules. `bootstrap.sh` never installs Docker, obtains credentials, or opens external services.

## Check status
```bash
docker compose ps
docker compose logs --tail=50 agent47
```
Only a single polling replica may run for a given Telegram bot token. For upgrades, review changes before `git pull`, then `docker compose up -d --build`. No external inbound port is required for polling.

## Operational cautions
- The pilot's access control is a numeric Telegram ID allowlist. Multi-director RBAC and cross-tenant isolation are not yet wired into the bot.
- Text/voice requests are sent to the configured AI provider. Do not send confidential student, financial, or personnel records until retention, consent, vendor agreements, and security controls are reviewed.
- All model responses are advisory; no real business write tools or payments are enabled.
- The 192 skill definitions are specifications, not 192 live tools.
- Rollback: `docker compose down` stops the bot; redeploy a known-good Git commit if needed.
