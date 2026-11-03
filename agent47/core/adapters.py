"""First non-sensitive, data-independent demonstration adapter."""
from datetime import datetime, timezone

def system_time_utc(payload: dict) -> str:
    return datetime.now(timezone.utc).isoformat()

# This is a demonstration adapter only. It does not access AIBI systems.
