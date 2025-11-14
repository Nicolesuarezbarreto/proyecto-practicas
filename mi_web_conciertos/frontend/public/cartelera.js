// frontend/public/cartelera.js
async function loadCartelera() {
  const container = document.querySelector('#cartelera');
  if (!container) {
    console.warn('#cartelera no encontrado');
    return;
  }

  const token = localStorage.getItem('token');
  console.log('cartelera: token presente?', !!token);

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
    };

    console.log('cartelera: haciendo fetch /api/artistas con headers', headers);
    const res = await fetch('http://localhost:3000/api/artistas', {
      method: 'GET',
      headers,
      cache: 'no-cache'
    });

    console.log('cartelera: response status', res.status);
    if (res.status === 401 || res.status === 403) {
      // No elimino token automáticamente; solo informo y muestro mensaje en UI
      container.innerHTML = '<p class="error">Acceso denegado. Iniciá sesión de nuevo.</p>';
      return;
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Sin body' }));
      console.error('cartelera: error al obtener artistas', res.status, err);
      container.innerText = 'Error cargando artistas: ' + (err.message || res.status);
      return;
    }

    const artistas = await res.json().catch(() => []);
    console.log('cartelera: artistas recibidos', artistas);

    if (!artistas || artistas.length === 0) {
      container.innerHTML = '<p class="empty">No hay artistas todavía. Creá uno desde la API o el panel.</p>';
      return;
    }

    container.innerHTML = artistas.map(a => `
      <div class="artist-card">
        <h3>${a.nombre || a.name || 'Sin nombre'}</h3>
        <div>${a.genero || a.genre || ''}</div>
        <div>${a.pais_origen || a.country || ''}</div>
        <div>${a.date || a.fecha || ''}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error('loadCartelera error:', err);
    container.innerText = 'No se pudo conectar al servidor';
  }
}
document.addEventListener('DOMContentLoaded', loadCartelera);
