from pydantic import BaseModel
from typing import Optional

class TaskRequest(BaseModel):
    intent: str
    user_id: Optional[str] = None

class TaskResponse(BaseModel):
    status: str
    message: str
