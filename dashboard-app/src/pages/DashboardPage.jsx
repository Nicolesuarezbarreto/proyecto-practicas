import { useEffect, useState } from 'react';
import { getDashboard } from '../services/dashboard';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getDashboard();
        if (active) setData(res);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <p>Cargando dashboard…</p>;
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <pre style={{ background: '#111', color: '#0f0', padding: 16, borderRadius: 8 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
