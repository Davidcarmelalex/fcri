class DeviceService:
    def register(self, device_id: str, platform: str):
        return {
            'device_id': device_id,
            'platform': platform,
            'status': 'registered'
        }
