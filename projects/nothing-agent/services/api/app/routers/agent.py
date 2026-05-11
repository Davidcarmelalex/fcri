from fastapi import APIRouter
from app.services.agent_service import AgentService
from app.schemas.task import TaskRequest

router = APIRouter()
agent_service = AgentService()

@router.post('/execute')
async def execute_agent_task(payload: TaskRequest):
    return agent_service.execute(payload.intent)
