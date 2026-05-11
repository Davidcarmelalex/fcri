const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function registerDevice(deviceId: string, platform: string) {
  const res = await fetch(`${API_BASE}/devices/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id: deviceId, platform })
  });
  return res.json();
}

export async function fetchDevices() {
  const res = await fetch(`${API_BASE}/devices/list`);
  return res.json();
}
