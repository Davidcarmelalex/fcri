from fastapi import APIRouter

router = APIRouter()

@router.get('/query')
async def query_memory(q: str = ''):
    return {'query': q, 'results': []}
