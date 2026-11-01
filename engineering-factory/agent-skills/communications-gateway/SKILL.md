# Communications engineering — SIP/PSTN, WhatsApp and outbound delivery
## Architecture
PSTN/SIP provider -> signed/verified webhook -> session events -> STT/LLM/TTS streaming -> AZRAEL intake; separate WhatsApp inbound text/media and outbound approved templates; provider abstraction for Indian telecom/SIP availability and data residency.
## Obligations
- Verify signatures + timestamps and replay resistance where supported; use HTTPS, least privilege and secret rotation.
- Idempotently log every observable ring/answered/abandoned/disconnected/failed event; mark carrier receipt separately from human acknowledgment.
- Caller ID may be unavailable, spoofed, shared, ported or reassigned. Subscriber KYC/CDRs/location require distinct legal authority: never query casually.
- Restrict outbound messages to safe windows, explicit preferences, permitted templates and verified case events. Retries must be bounded; supervisor receives undelivered backlog.
- Fall back to staff/queue on STT uncertainty, voice provider outage or distressed caller.
## Acceptance
Mock webhook contract, duplicates and outage replay, 2 simultaneous callers, no plaintext secrets in logs, failed delivery not called delivered, unsafe callbacks blocked.
