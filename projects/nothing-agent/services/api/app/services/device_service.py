from sqlalchemy.orm import Session
from app.repositories.device_repository import DeviceRepository

class DeviceService:
    def __init__(self):
        self.repo = DeviceRepository()

    def register(self, db: Session, device_id: str, platform: str):
        return self.repo.create(db, device_id, platform)
