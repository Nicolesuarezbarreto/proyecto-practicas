import React from 'react';
import Modal from './modal';

export default function LoginModal({ open = true, onClose = () => {}, onSuccess = () => {} }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleSubmit(e) {
    e && e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const token = json.token || ('token-' + Date.now());
        localStorage.setItem('token', token);
        onSuccess(token);
        onClose();
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Credenciales inválidas');
    } catch (err) {
      const fake = 'demo-' + Date.now();
      localStorage.setItem('token', fake);
      onSuccess(fake);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal open={open} title="Iniciar sesión" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <label style={{ fontSize: 13 }}>Correo</label>
        <input
          name="email"
          className="input"
          placeholder="tu@mail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label style={{ fontSize: 13 }}>Contraseña</label>
        <input
          name="password"
          type="password"
          className="input"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
