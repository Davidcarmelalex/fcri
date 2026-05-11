from fastapi import FastAPI
from app.models.device_orm import DeviceORM
from app.routers import health, tasks, agent, devices, memory, device_list, auth
from app.db import init_db

_ = DeviceORM
init_db()

app = FastAPI(
    title='MR NOTHING API',
    version='0.1.0',
    description='Agentic mobile execution backend'
)

app.include_router(health.router, prefix='/health', tags=['health'])
app.include_router(auth.router, prefix='/auth', tags=['auth'])
app.include_router(tasks.router, prefix='/tasks', tags=['tasks'])
app.include_router(agent.router, prefix='/agent', tags=['agent'])
app.include_router(devices.router, prefix='/devices', tags=['devices'])
app.include_router(device_list.router, prefix='/devices/list', tags=['devices'])
app.include_router(memory.router, prefix='/memory', tags=['memory'])
