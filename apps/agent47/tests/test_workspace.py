import pytest
from app import workspace


def test_workspace_roundtrip(monkeypatch, tmp_path):
    monkeypatch.setattr(workspace, "ROOT", tmp_path)
    assert workspace.write_text("reports/result.txt", "hello")["bytes"] == 5
    assert workspace.read_text("reports/result.txt") == "hello"
    with pytest.raises(FileExistsError):
        workspace.write_text("reports/result.txt", "overwrite")


@pytest.mark.parametrize("path", ["../escape", "/etc/passwd", ".env", "a/../b", "a/.secrets"])
def test_workspace_rejects_paths(monkeypatch, tmp_path, path):
    monkeypatch.setattr(workspace, "ROOT", tmp_path)
    with pytest.raises(ValueError):
        workspace.resolve(path)


def test_workspace_rejects_symlink(monkeypatch, tmp_path):
    monkeypatch.setattr(workspace, "ROOT", tmp_path / "workspace")
    workspace.ROOT.mkdir()
    (workspace.ROOT / "link").symlink_to(tmp_path, target_is_directory=True)
    with pytest.raises(ValueError):
        workspace.resolve("link/secret.txt")


def test_workspace_rejects_oversized(monkeypatch, tmp_path):
    monkeypatch.setattr(workspace, "ROOT", tmp_path)
    with pytest.raises(ValueError):
        workspace.write_text("huge.txt", "a" * (workspace.MAX_BYTES + 1))
