"""Safe metadata-only skill catalog. This module never executes skill content."""
from dataclasses import dataclass
import re

_ID = re.compile(r"^[a-z][a-z0-9_-]{1,47}$")
ALLOWED_CAPABILITIES = frozenset({"reason", "calculate", "summarize", "classify"})

@dataclass(frozen=True)
class Skill:
    id: str
    name: str
    version: str
    description: str
    capabilities: tuple[str, ...]

    def as_dict(self):
        return {"id": self.id, "name": self.name, "version": self.version,
                "description": self.description, "capabilities": list(self.capabilities),
                "executable": False}


def validate(skill):
    if not _ID.fullmatch(skill.id):
        raise ValueError("Invalid skill identifier")
    if not skill.name or len(skill.name) > 100:
        raise ValueError("Invalid skill name")
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", skill.version):
        raise ValueError("Invalid semantic version")
    if len(skill.description) > 500:
        raise ValueError("Description too long")
    if not set(skill.capabilities).issubset(ALLOWED_CAPABILITIES):
        raise ValueError("Unapproved capability")
    return skill


SKILLS = tuple(map(validate, [
    Skill("research-brief", "Research Brief", "0.1.0",
          "Prepare structured research summaries without external retrieval.", ("reason", "summarize")),
    Skill("arithmetic", "Arithmetic", "0.1.0",
          "Use the bounded arithmetic calculator.", ("calculate",)),
    Skill("document-triage", "Document Triage", "0.1.0",
          "Classify user-provided text without accessing the filesystem.", ("classify", "summarize")),
]))


def list_skills():
    return [skill.as_dict() for skill in SKILLS]
