from fastapi import APIRouter

router = APIRouter()

@router.post('/register')
async def register_device(payload: dict):
    return {'status': 'registered', 'device': payload}
