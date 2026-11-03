"""Validate and load AGENT47's declarative skill catalogue."""
import json
from pathlib import Path

REGISTRY_PATH = Path(__file__).resolve().parents[1] / "skills" / "master-registry.json"

def load_registry(path: Path = REGISTRY_PATH) -> dict[str, dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    skills = {}
    for domain in data["domains"]:
        for skill in domain["skills"]:
            sid = skill["id"]
            if sid in skills or not sid.startswith(domain["id"] + "."):
                raise ValueError(f"Invalid or duplicate skill ID: {sid}")
            if skill.get("default_access") != "deny":
                raise ValueError(f"Skill must deny by default: {sid}")
            skills[sid] = skill
    return skills
