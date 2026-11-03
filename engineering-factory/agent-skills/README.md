# AZRAEL AGENT SKILLS — PHASE 1 (2026-11-01)

This directory is the training and acceptance syllabus for AZRAEL engineering agents. Read `SKILL.md` before editing a related subsystem. **Documentation does not install provider SDKs, grant provider credentials or train model weights.**

## Skill routing
| Engineering agent | Mandatory skill | Proof of proficiency |
|---|---|---|
| Voice / Conversation | `voice-elevenlabs-sarvam/SKILL.md` | streaming demo, interruption handling, language test matrix |
| Citizen Care | `trauma-informed-intake/SKILL.md` | measured empathy and safe escalation evals |
| Telecom / WhatsApp | `communications-gateway/SKILL.md` | signed-webhook replay, call-disconnect and retry tests |
| Case Guardian | `case-continuity/SKILL.md` | durable, consent-bound updates and safe resumption |
| Investigation / Evidence | `investigative-safety/SKILL.md` | provenance, custody, human approval and forbidden-operation tests |

## Provider selection
Treat STT, LLM, TTS, telephony, notifications, transcript storage and case engine as interchangeable provider interfaces. Sarvam Saaras v3 is documented for 22 Indian languages plus English transcription; Bulbul v3 TTS supports a narrower set of 10 Indian languages plus English. Thus **22-language TTS must not be claimed** without individual fallback verification. ElevenLabs ElevenAgents supports real-time agent web sockets, voice integration, SIP/Twilio and testing/evals, but production language coverage, availability, privacy and pricing must be verified for each deployment.

## Definition of ready
Provider secrets provisioned by approved secret management; signed server-side sessions; approved retention and data handling; language confidence fallback; real human escalation; real bank/1930 safety advice; no invented police progress; verified webhook requests; scoped database auth; retries and idempotency; outage drills; measured latency/error/quality; evidence-backed test reports. Integration is MOCK until verified against an authorized live account.

## Official documentation
- https://elevenlabs.io/docs/eleven-agents/overview
- https://elevenlabs.io/docs/eleven-agents/libraries/web-sockets
- https://elevenlabs.io/docs/eleven-agents/quickstart
- https://elevenlabs.io/docs/overview/capabilities/speech-engine
- https://docs.sarvam.ai/api/getting-started/building-for-india
- https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/streaming-api/web-socket
