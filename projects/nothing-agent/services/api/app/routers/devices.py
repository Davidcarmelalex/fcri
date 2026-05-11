from fastapi import APIRouter
from app.services.device_service import DeviceService

router = APIRouter()
device_service = DeviceService()

@router.post('/register')
async def register_device(payload: dict):
    return device_service.register(
        payload.get('device_id', 'unknown'),
        payload.get('platform', 'android')
    )
