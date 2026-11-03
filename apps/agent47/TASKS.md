# Task API — Experimental

Task endpoints use the existing prototype API-key authentication.

* `POST /v1/tasks`: create a task with JSON `{"agent":"research","prompt":"..."}`.
* `GET /v1/tasks`: list recent tasks (no prompt bodies returned).
* `GET /v1/tasks/{id}`: get task state and result.
* `POST /v1/tasks/{id}/execute`: **explicitly** run one pending task using the configured model provider.

Agents are currently named role prompts, not independently deployed specialist models or autonomous workers. Execution is synchronous, not a background worker queue. The task table is durable on the Docker volume but a crash during execution can leave a task in `running` state. This needs a recovery mechanism before production.

The single shared API key provides no per-user isolation. Do not enable this for directors or untrusted users. The model's only executable tool remains the allowlisted arithmetic calculator.
