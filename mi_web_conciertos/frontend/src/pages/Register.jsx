import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Usa ruta relativa para aprovechar el proxy de Vite si lo tenés configurado.
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        // Si el backend devuelve un token, lo guardamos para usarlo luego
        const { token } = data || {};
        if (token) localStorage.setItem('token', token);

        console.log('registrado correctamente', email);
        alert('Registro exitoso');
        navigate('/');
      } else {
        alert(data?.message || 'Error en el registro');
        console.error('registro falló', data);
      }
    } catch (err) {
      console.error('Error de conexión', err);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Registro</h2>
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ display: 'block', width: '100%', margin: '8px 0' }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ display: 'block', width: '100%', margin: '8px 0' }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ display: 'block', width: '100%', margin: '8px 0' }}
      />
      <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}

export default Register;
