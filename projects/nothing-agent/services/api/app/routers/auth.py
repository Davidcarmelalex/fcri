from fastapi import APIRouter
from app.auth.security import create_access_token

router = APIRouter()

@router.post('/login')
async def login(payload: dict):
    username = payload.get('username', 'demo')
    return {
        'access_token': create_access_token(username),
        'token_type': 'bearer'
    }
