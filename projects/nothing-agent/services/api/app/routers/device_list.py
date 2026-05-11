from fastapi import APIRouter, Depends
from app.dependencies import get_db
from app.models.device_orm import DeviceORM
from sqlalchemy.orm import Session

router = APIRouter()

@router.get('/')
async def list_devices(db: Session = Depends(get_db)):
    devices = db.query(DeviceORM).all()
    return {
        'devices': [
            {
                'device_id': d.device_id,
                'platform': d.platform,
                'status': d.status
            }
            for d in devices
        ]
    }
