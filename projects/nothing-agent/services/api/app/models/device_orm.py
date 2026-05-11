from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.database import Base

class DeviceORM(Base):
    __tablename__ = 'devices'

    device_id: Mapped[str] = mapped_column(String, primary_key=True)
    platform: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default='active')
