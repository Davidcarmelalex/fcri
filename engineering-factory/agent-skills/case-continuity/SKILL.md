# Case memory, officer handover and Guardian scheduling
## Build target
Durable person/contact/case separation, authenticated case linkage, multilingual dialogue, verified fact provenance, officer assignment and role-limited handover. No global unlimited phone-number dossiers.
## Workflow
Received -> triaged -> assigned -> investigated -> human disposition -> citizen notified; every transition auditable, with escalation for missed milestones.
## Engineering
Use transactional outbox/queue and idempotency keys; lease expiries, bounded retries and dead-letter review. Contact consent and safe-channel preference verified at send time. Record provider acknowledgment and citizen communication outcomes distinctly. Audit status updates against source case events. Officer decisions and statutory closure require competent human authority.
## Test
Known/unknown/shared/reassigned number, unauthorized resume, no consent, withdrawal, closure, duplicate event, failover, concurrent worker claims, late updates, supervisor escalation.
