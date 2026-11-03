# AGENT47 — FCRI Labs

Telegram-first executive command center for AIBI Campus. **Prototype, not production-ready.**

## MVP
- Telegram bot accepts plain-language English/Malayalam commands and voice-note placeholders.
- /start, /help, /briefing, /tasks, /admissions, /finance, /approvals.
- Demonstration data only until AIBI grants authorized data access.
- Role-based user allowlist and action approval before any outbound or financial operation.
- Audit logging, tenant isolation and rate limiting are required before production.

## Run
1. Python 3.11+: `pip install -r agent47/requirements.txt`
2. Set `TELEGRAM_BOT_TOKEN` and `AGENT47_ALLOWED_USER_IDS` environment variables (comma-separated numeric IDs).
3. Run `python agent47/bot.py` from the repository root.
4. Message your bot `/start` in Telegram.

**Security:** Never commit bot tokens. Use a secret manager in production. This MVP is read-only; no payments, employee actions, or messages are executed.

## Architecture roadmap
Telegram -> authenticated command router -> policy/approval engine -> executive orchestrator -> specialist adapters (finance, admissions, HR, academic, marketing, R&D) -> authorized AIBI APIs. Use FAASI Core to benchmark reliability and SystemOperator as an integration reference after code review. Add PostgreSQL, queue workers, observability, durable approval records, and Telegram Mini App for production.
