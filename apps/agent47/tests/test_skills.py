import pytest
from app.skills import Skill, list_skills, validate


def test_catalog_is_non_executable():
    catalog = list_skills()
    assert len(catalog) >= 3
    assert all(s["executable"] is False for s in catalog)


def test_reject_unapproved_capability():
    with pytest.raises(ValueError):
        validate(Skill("unsafe-skill", "Unsafe", "1.0.0", "Test", ("shell",)))


def test_reject_bad_version():
    with pytest.raises(ValueError):
        validate(Skill("safe-skill", "Safe", "latest", "Test", ("reason",)))
