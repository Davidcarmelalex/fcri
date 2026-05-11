from pydantic import BaseModel
from typing import List

class MemoryRecord(BaseModel):
    key: str
    values: List[str] = []
