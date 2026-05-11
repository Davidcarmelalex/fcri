from app.repositories.device_repository import DeviceRepository

class DeviceService:
    def __init__(self):
        self.repo = DeviceRepository()

    def register(self, device_id: str, platform: str):
        device = self.repo.create(device_id, platform)
        device['status'] = 'registered'
        return device
