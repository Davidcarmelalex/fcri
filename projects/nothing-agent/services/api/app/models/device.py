from pydantic import BaseModel

class Device(BaseModel):
    device_id: str
    platform: str
    status: str = 'active'
