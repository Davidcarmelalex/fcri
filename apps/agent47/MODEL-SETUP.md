# Model-backed Agent 47

M1 introduces an actual model-backed execution loop with a single allowlisted arithmetic tool, a local CLI, and SQLite conversation history. It is **not** an unrestricted autonomous system.

Set these server-side environment variables (do not expose them in browser JavaScript):

```bash
AGENT47_MODEL_BASE_URL=https://your-provider.example/v1
AGENT47_MODEL_API_KEY=your-secret
AGENT47_MODEL=your-model-id
AGENT47_DB_PATH=/data/agent47.db
```

The endpoint must implement the OpenAI-compatible `/chat/completions` API with tool calls. Compatibility varies by provider and model; verify before production. Only configure trusted provider URLs because the server sends its API key to that endpoint. Use a provider endpoint without URL query parameters or path tricks.

To use CLI on a Python installation:

```bash
cd apps/agent47
python3 -m app.cli
```

HTTP API: `POST /v1/chat` with `X-API-Key` and JSON `{"prompt":"What is 2+2?","session":null}`.

The current API-key scheme is single-user prototype access. Do not deploy it for multiple directors or internet-facing access. Model requests have a fixed timeout and bounded tool-call loop. The runtime has no browser, shell, filesystem editing, network scanning, or code-execution tool.

SQLite stores conversation text unencrypted; protect the volume and do not enter confidential information until encryption, user isolation, retention and backup controls are implemented.
