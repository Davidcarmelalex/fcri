from fastapi import FastAPI
from app.routers import health, tasks, agent, devices, memory
from app.db import init_db

init_db()

app = FastAPI(
    title='MR NOTHING API',
    version='0.1.0',
    description='Agentic mobile execution backend'
)

app.include_router(health.router, prefix='/health', tags=['health'])
app.include_router(tasks.router, prefix='/tasks', tags=['tasks'])
app.include_router(agent.router, prefix='/agent', tags=['agent'])
app.include_router(devices.router, prefix='/devices', tags=['devices'])
app.include_router(memory.router, prefix='/memory', tags=['memory'])
