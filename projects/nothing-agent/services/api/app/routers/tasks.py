from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def list_tasks():
    return {'tasks': [], 'message': 'Task subsystem scaffold initialized'}
