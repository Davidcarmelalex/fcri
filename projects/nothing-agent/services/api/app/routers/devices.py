from fastapi import APIRouter, Depends
from app.services.device_service import DeviceService
from app.dependencies import get_db

router = APIRouter()
device_service = DeviceService()

@router.post('/register')
async def register_device(payload: dict, db = Depends(get_db)):
    return device_service.register(
        db,
        payload.get('device_id', 'unknown'),
        payload.get('platform', 'android')
    )
