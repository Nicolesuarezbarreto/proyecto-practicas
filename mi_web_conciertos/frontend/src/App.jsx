import React, { useState, useEffect } from "react";
import Header from "./components/header";
import Modal from "./components/modal";
import CarteleraGrid from "./components/carteleraGrid";
import LoginModal from "./components/loginModal";

function CreateEventForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: '', date: '', place: '', price: '', tags: '', img: '' });

  function change(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      title: form.title,
      date: form.date,
      place: form.place,
      price: form.price,
      img: form.img,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean)
    };
    if (typeof onSubmit === 'function') {
      await onSubmit(payload);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <input name="title" className="input" placeholder="Título" value={form.title} onChange={change} required />
      <input name="date" className="input" placeholder="Fecha y hora (ej. 24 Nov 20:00)" value={form.date} onChange={change} required />
      <input name="place" className="input" placeholder="Lugar" value={form.place} onChange={change} required />
      <input name="price" className="input" placeholder="Precio" value={form.price} onChange={change} />
      <input name="img" className="input" placeholder="URL imagen (opcional)" value={form.img} onChange={change} />
      <input name="tags" className="input" placeholder="Tags (separados por coma)" value={form.tags} onChange={change} />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Crear</button>
      </div>
    </form>
  );
}

export default function App() {
  const [counts, setCounts] = useState({ artistas: 0, conciertos: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(typeof window !== 'undefined' && localStorage.getItem('token'))
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [cRes, eRes] = await Promise.allSettled([
          fetch('/api/artistas/count'),
          fetch('/api/cartelera')
        ]);

        if (mounted) {
          if (cRes.status === 'fulfilled' && cRes.value.ok) {
            const cjson = await cRes.value.json();
            setCounts(prev => ({
              ...prev,
              artistas: cjson.count ?? cjson.artistas ?? prev.artistas
            }));
          }
          if (eRes.status === 'fulfilled' && eRes.value.ok) {
            const eventsJson = await eRes.value.json();
            setEvents(
              Array.isArray(eventsJson) ? eventsJson : (eventsJson.data ?? [])
            );
          }
        }
      } catch (err) {
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, []);

  const sample = [
    { id: 's1', title: 'Festival Indie - Fiesta grande', date: '24 Nov 20:00', place: 'Sala X', price: '$2500', tags: ['Indie', '18+'], img: '' },
    { id: 's2', title: 'Noche Electrónica - DJs invitados', date: '30 Nov 23:00', place: 'Club Y', price: '$1800', tags: ['Electrónica', '21+'], img: '' },
    { id: 's3', title: 'Concierto Rock - Banda X', date: '05 Dic 21:00', place: 'Estadio Z', price: '$3000', tags: ['Rock', 'Todo público'], img: '' },
  ];

  const displayed = events.length ? events : sample;

  function handleView(id) {
    const ev = displayed.find(x => (x.id ?? x._id) === id) || null;
    setDetailEvent(ev);
    setDetailOpen(true);
  }

  function openCreate() {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    setCreateOpen(true);
  }

  async function handleCreateSubmit(formData) {
    try {
      const res = await fetch('/api/cartelera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setCreateOpen(false);
        const eRes = await fetch('/api/cartelera');
        if (eRes.ok) {
          const eventsJson = await eRes.json();
          setEvents(
            Array.isArray(eventsJson) ? eventsJson : (eventsJson.data ?? [])
          );
          return;
        }
      }
    } catch {}
    setEvents(prev => [{ id: 'local-' + Date.now(), ...formData }, ...prev]);
    setCreateOpen(false);
  }

  function handleLoginSuccess(token) {
    setIsAuthenticated(true);
    setLoginOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  return (
    <>
      <Header onCreate={openCreate} onLogout={handleLogout} authenticated={isAuthenticated} />

      <main className="container" style={{ paddingTop: 12 }}>
        {isAuthenticated && (
          <section className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <h2 style={{ margin: 0 }}>Dashboard</h2>
              <p style={{ margin: 4, color: 'var(--muted)' }}>
                <strong>Artistas:</strong> {counts.artistas} &nbsp;·&nbsp;
                <strong>Conciertos:</strong> {counts.conciertos}
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => window.location.reload()}>Refrescar</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const grid = document.querySelector('.grid');
                  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Ir a cartelera
              </button>
            </div>
          </section>
        )}

        <h3 style={{ margin: '18px 0 8px 0' }}>Cartelera</h3>

        {loading ? (
          <div className="card center" style={{ padding: 40 }}>Cargando eventos…</div>
        ) : (
          <CarteleraGrid events={displayed} onView={handleView} />
        )}
      </main>

      <Modal open={detailOpen} title={detailEvent?.title ?? 'Detalle de evento'} onClose={() => setDetailOpen(false)}>
        {detailEvent ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ color: 'var(--muted)' }}>{detailEvent.date}</div>
            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
              {detailEvent.price ?? 'Consultar'}
            </div>
            <div>{detailEvent.place}</div>
            <p style={{ marginTop: 8 }}>{detailEvent.description ?? 'Sin descripción'}</p>
          </div>
        ) : (
          <div>No se encontró detalle</div>
        )}
      </Modal>

      <Modal open={createOpen} title="Crear evento" onClose={() => setCreateOpen(false)}>
        <CreateEventForm
          onCancel={() => setCreateOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      </Modal>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />
    </>
  );
}
