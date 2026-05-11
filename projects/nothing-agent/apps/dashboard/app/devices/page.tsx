'use client';

import { useState } from 'react';
import { registerDevice } from '../lib/api';

export default function DevicesPage() {
  const [result, setResult] = useState<any>(null);

  async function handleRegister() {
    const data = await registerDevice('dashboard-demo-001', 'dashboard');
    setResult(data);
  }

  return (
    <main>
      <h1>Device Registry</h1>
      <button onClick={handleRegister}>Register Demo Device</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
