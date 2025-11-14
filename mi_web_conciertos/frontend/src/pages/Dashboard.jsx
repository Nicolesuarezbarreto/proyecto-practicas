import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const res = await fetch('http://localhost:3000/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          alert('Sesión inválida o expirada. Volvé a iniciar sesión.');
          navigate('/');
          return;
        }

        if (!res.ok) {
          const text = await res.text().catch(() => 'Respuesta inesperada del servidor');
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data = await res.json();
        // Si el backend envía un objeto con "mensaje" cuando hay acceso denegado,
        // tratamos ese caso como fallo; si envía el resumen, lo mostramos.
        if (data.mensaje && Object.keys(data).length === 1) {
          // caso explícito de mensaje (p.ej. acceso denegado)
          alert('Acceso denegado');
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        // adaptar según la estructura real del dashboard
        // si el backend devuelve un resumen, mostramos un mensaje simple
        setMensaje(
          data.total_artistas !== undefined
            ? `Artistas: ${data.total_artistas} · Conciertos: ${data.total_conciertos}`
            : JSON.stringify(data)
        );
      } catch (err) {
        console.error('Carga dashboard:', err);
        alert('No se pudo cargar el dashboard. Revisá la consola.');
        navigate('/');
      }
    };

    load();
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{mensaje}</p>
    </div>
  );
}

export default Dashboard;
