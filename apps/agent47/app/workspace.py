"""Confined text workspace. No symlinks, absolute paths or traversal."""
import os
from pathlib import Path

MAX_BYTES = 256_000
ROOT = Path(os.getenv("AGENT47_WORKSPACE", "/tmp/agent47-workspace"))


def resolve(relative: str) -> Path:
    if not isinstance(relative, str) or not relative or len(relative) > 240:
        raise ValueError("Invalid workspace path")
    path = Path(relative)
    if path.is_absolute() or any(part in ("..", ".", "") for part in path.parts):
        raise ValueError("Path traversal forbidden")
    if any(part.startswith(".") for part in path.parts):
        raise ValueError("Hidden paths forbidden")
    root = ROOT.resolve()
    root.mkdir(parents=True, exist_ok=True)
    candidate = root / path
    for parent in (candidate, *candidate.parents):
        if parent == root:
            break
        if parent.is_symlink():
            raise ValueError("Symlinks forbidden")
    if not candidate.resolve().is_relative_to(root):
        raise ValueError("Path outside workspace")
    return candidate


def read_text(relative: str) -> str:
    path = resolve(relative)
    if not path.is_file() or path.is_symlink():
        raise FileNotFoundError("Workspace file not found")
    if path.stat().st_size > MAX_BYTES:
        raise ValueError("File too large")
    return path.read_text(encoding="utf-8")


def write_text(relative: str, content: str) -> dict:
    if not isinstance(content, str) or len(content.encode("utf-8")) > MAX_BYTES:
        raise ValueError("Content exceeds size limit")
    path = resolve(relative)
    if path.exists():
        raise FileExistsError("Overwriting files is disabled")
    path.parent.mkdir(parents=True, exist_ok=True)
    # O_EXCL prevents accidental overwrites; O_NOFOLLOW blocks final symlink.
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, "O_NOFOLLOW", 0)
    fd = os.open(path, flags, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as stream:
        stream.write(content)
    return {"path": relative, "bytes": len(content.encode("utf-8"))}
