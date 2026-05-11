class DeviceRepository:
    def create(self, device_id: str, platform: str):
        return {
            'device_id': device_id,
            'platform': platform,
            'stored': True
        }
