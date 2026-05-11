from sqlalchemy.orm import Session
from app.models.device_orm import DeviceORM

class DeviceRepository:
    def create(self, db: Session, device_id: str, platform: str):
        device = DeviceORM(device_id=device_id, platform=platform, status='registered')
        db.add(device)
        db.commit()
        db.refresh(device)
        return {
            'device_id': device.device_id,
            'platform': device.platform,
            'status': device.status
        }
