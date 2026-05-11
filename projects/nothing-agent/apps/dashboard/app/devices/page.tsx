'use client';

import { useEffect, useState } from 'react';
import { registerDevice, fetchDevices } from '../lib/api';

export default function DevicesPage() {
  const [result, setResult] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);

  async function refreshDevices() {
    const data = await fetchDevices();
    setDevices(data.devices || []);
  }

  async function handleRegister() {
    const data = await registerDevice('dashboard-demo-001', 'dashboard');
    setResult(data);
    refreshDevices();
  }

  useEffect(() => {
    refreshDevices();
  }, []);

  return (
    <main>
      <h1>Device Registry</h1>
      <button onClick={handleRegister}>Register Demo Device</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <h2>Connected Devices</h2>
      <pre>{JSON.stringify(devices, null, 2)}</pre>
    </main>
  );
}
