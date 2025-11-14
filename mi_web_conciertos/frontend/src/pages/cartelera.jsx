import React, { useEffect, useState } from 'react';

// Si tu fetch necesita token, adapta headers con Authorization: 'Bearer ' + localStorage.getItem('token')

export default function Cartelera() {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/artistas'); // si no usás proxy: 'http://localhost:3000/api/artistas'
        const data = await res.json().catch(() => []);
        if (mounted) setArtistas(Array.isArray(data) ? data : data.artistas || []);
      } catch (e) {
        console.error('Error cargando artistas', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // filtrado simple: nombre o género y filtro por género
  const filtered = artistas.filter(a =>
    (a.nombre || '').toLowerCase().includes(query.toLowerCase()) &&
    (genreFilter ? (a.genero || '').toLowerCase() === genreFilter.toLowerCase() : true)
  );

  function openDetail(artista) { setDetail(artista); }
  function closeDetail() { setDetail(null); }

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", background: '#f6f7fb', minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Cartelera</h1>
          <nav>
            <a href="/" style={{ marginRight: 12, color: '#333', textDecoration: 'none' }}>Home</a>
            <a href="/register" style={{ marginRight: 12, color: '#333', textDecoration: 'none' }}>Registrarse</a>
            <a href="/login" style={{ color: '#333', textDecoration: 'none' }}>Login</a>
          </nav>
        </header>

        {/* Búsqueda + filtro */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar artista o género"
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e0e0e0' }}
          />
          <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)} style={{ padding: 10, borderRadius: 8, border: '1px solid #e0e0e0' }}>
            <option value="">Todos</option>
            {/* Si querés, amplía la lista; también podrías mapear géneros desde artistas */}
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Indie">Indie</option>
          </select>
        </div>

        {/* Estado loading */}
        {loading && <div style={{ textAlign: 'center', padding: 40 }}>Cargando artistas...</div>}

        {/* Grid de cards */}
        {!loading && (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {filtered.length === 0 && <div style={{ gridColumn: '1/-1', color: '#666' }}>No se encontraron artistas.</div>}
            {filtered.map(a => (
              <div key={a.id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ height: 140, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={a.imagen || `https://picsum.photos/seed/${a.id}/600/400`}
                    alt={a.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>

                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{a.nombre}</h3>
                  <p style={{ margin: '6px 0', color: '#666', fontSize: 13 }}>{a.genero || 'Sin género'}</p>

                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => openDetail(a)} style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', background: '#1db954', color: '#fff', cursor: 'pointer' }}>
                      Ver
                    </button>
                    <a href={a.spotify || '#'} target="_blank" rel="noreferrer" style={{ padding: '8px 10px', borderRadius: 8, background: '#111', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Spotify
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal detalle */}
        {detail && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
            <div style={{ width: 520, maxWidth: '95%', background: '#fff', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>{detail.nombre}</h2>
                <button onClick={closeDetail} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>

              <p style={{ color: '#666', marginTop: 8 }}>{detail.genero || 'Sin género'} • {detail.pais_origen || 'Origen desconocido'}</p>

              <p style={{ marginTop: 12 }}>
                {detail.spotify ? <a href={detail.spotify} target="_blank" rel="noreferrer">Spotify</a> : <span style={{ color: '#999' }}>Spotify</span>}
                {detail.youtube ? <a href={detail.youtube} target="_blank" rel="noreferrer" style={{ marginLeft: 12 }}>YouTube</a> : null}
                {detail.web ? <a href={detail.web} target="_blank" rel="noreferrer" style={{ marginLeft: 12 }}>Web</a> : null}
              </p>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ margin: '8px 0' }}>Fechas</h4>
                {detail.fechas && detail.fechas.length > 0 ? (
                  detail.fechas.map((f, i) => <div key={i} style={{ padding: 6, borderRadius: 6, background: '#f2f2f2', marginBottom: 6 }}>{f}</div>)
                ) : (
                  <div style={{ color: '#999' }}>Sin fechas disponibles</div>
                )}
              </div>

              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <button onClick={closeDetail} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#333', color: '#fff' }}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
