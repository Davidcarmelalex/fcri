# Voice skill — ElevenLabs + Sarvam AI
## Goal
Produce human-sounding but transparently AI speech for victims, with calm prosody, real turn-taking, interruptions, code switching and immediate human fallback.
## Learn and implement
1. ElevenAgents WebSocket session lifecycle, server-side signed URL for private agents, stream events, audio chunk formats, backpressure, disconnect/resume, barge-in and telephony SIP/Twilio. Never expose an API key to a browser or caller.
2. Evaluate ElevenLabs Speech Engine when AZRAEL retains its own LLM/orchestration; compare a managed ElevenAgent with custom Sarvam STT -> protected AZRAEL reasoning -> Sarvam/ElevenLabs TTS.
3. Sarvam Saaras v3 STT in 22 Indian languages + English, script and code-mixing handling, dialect confidence, phonetic named-entity preservation. Sarvam Bulbul v3 streaming TTS only for verified supported language set; automatically fallback to validated other engines or a human, never fake language support.
4. Normalize 8 kHz PSTN audio, codec conversion, low-latency VAD, echo cancellation, streaming TTS response, interruption cancellation and disclosure that AI is speaking.
5. Create per-language golden speech datasets with native-speaker review. Test Malayalam, Hindi, Tamil, Bengali, Telugu, Kannada and code-switched mixes first; expand to all 22 with acceptance evidence.
6. Capture consent/recording notice, redaction, encryption, data-processing boundaries, and configurable retention. No speech vendor has independent access to sensitive police case data beyond the approved purpose.
## Practical exercise
Offline mock STT -> complaint -> deterministic triage -> generated response -> fake TTS, plus adapter-contract tests; then gated real sandbox test when credentials are provided.
## Pass criteria
95th percentile end-of-turn latency documented; interruption works; recordings are not stored without authorization; human takeover works; 22-language claim is capability-specific; no recording falsely marked as a real police call.
