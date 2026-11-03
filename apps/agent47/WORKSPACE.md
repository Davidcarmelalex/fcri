# Workspace API — constrained preview

All workspace endpoints require the shared prototype API key. The workspace is mounted at `/data/workspace` in Docker.

- `POST /v1/workspace/read` with `{"path":"reports/result.txt"}` reads a UTF-8 file.
- `POST /v1/workspace/write` with `{"path":"reports/result.txt","content":"..."}` creates a new UTF-8 file.

Limits: 256 KB per file, no overwrite, no absolute paths, no hidden paths, no symlinks and no `..` traversal. These endpoints are **direct user actions**; the model cannot invoke them. They do not provide OS-level sandbox isolation. This implementation must not be exposed to untrusted users until per-user permissions, filesystem race-hardening and deployment security testing are complete.
