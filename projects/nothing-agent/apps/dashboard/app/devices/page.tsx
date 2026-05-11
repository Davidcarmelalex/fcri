'use client';

import { useEffect, useState } from 'react';
import { registerDevice, fetchDevices } from '../lib/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);

  async function refreshDevices() {
    const data = await fetchDevices();
    setDevices(data.devices || []);
  }

  async function handleRegister() {
    await registerDevice('dashboard-demo-001', 'dashboard');
    refreshDevices();
  }

  useEffect(() => {
    refreshDevices();
  }, []);

  return (
    <main>
      <h1>MR NOTHING Device Registry</h1>
      <button onClick={handleRegister}>Register Demo Device</button>
      <h2>Connected Devices</h2>
      <table>
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Platform</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d, i) => (
            <tr key={i}>
              <td>{d.device_id}</td>
              <td>{d.platform}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
