const db = require('../config/db');

// Helper para formatear fecha legible
const formatFechaAR = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires'
  }).format(d);
};

// DTO para limpiar y reordenar campos del concierto
const conciertoDTO = (row) => {
  if (!row) return null;
  return {
    artista: row.artista,
    fecha: formatFechaAR(row.fecha),
    fecha_iso: row.fecha,
    ciudad: row.ciudad,
    lugar: row.lugar,
    ticket_url: row.ticket_url,
    id: row.id
  };
};

const getDashboard = (req, res) => {
  const usuario_id = req.usuario.id;
  console.log(`📊 [GET /api/dashboard] Generando resumen para usuario ${usuario_id}`);

  const dashboard = {};

  // 1️⃣ Total de artistas
  const queryArtistas = 'SELECT COUNT(*) AS total_artistas FROM artistas WHERE usuario_id = ?';
  db.query(queryArtistas, [usuario_id], (err, artistasResult) => {
    if (err) {
      console.error('❌ Error al contar artistas:', err.message);
      return res.status(500).json({ message: 'Error al generar dashboard' });
    }

    dashboard.total_artistas = artistasResult[0].total_artistas;

    // 2️⃣ Total de conciertos
    const queryConciertos = 'SELECT COUNT(*) AS total_conciertos FROM conciertos WHERE usuario_id = ?';
    db.query(queryConciertos, [usuario_id], (err, conciertosResult) => {
      if (err) {
        console.error('❌ Error al contar conciertos:', err.message);
        return res.status(500).json({ message: 'Error al generar dashboard' });
      }

      dashboard.total_conciertos = conciertosResult[0].total_conciertos;

      // 3️⃣ Último concierto realizado (fecha pasada)
      const queryUltimoRealizado = `
        SELECT c.*, a.nombre AS artista 
        FROM conciertos c
        JOIN artistas a ON c.artista_id = a.id
        WHERE c.usuario_id = ? AND c.fecha < CURDATE()
        ORDER BY c.fecha DESC
        LIMIT 1
      `;
      db.query(queryUltimoRealizado, [usuario_id], (err, ultimoResult) => {
        if (err) {
          console.error('❌ Error al obtener último concierto realizado:', err.message);
          return res.status(500).json({ message: 'Error al generar dashboard' });
        }

        dashboard.ultimo_concierto_realizado = conciertoDTO(ultimoResult[0]) || null;

        // 4️⃣ Próximo concierto programado (fecha futura o actual)
        const queryProximo = `
          SELECT c.*, a.nombre AS artista 
          FROM conciertos c
          JOIN artistas a ON c.artista_id = a.id
          WHERE c.usuario_id = ? AND c.fecha >= CURDATE()
          ORDER BY c.fecha ASC
          LIMIT 1
        `;
        db.query(queryProximo, [usuario_id], (err, proximoResult) => {
          if (err) {
            console.error('❌ Error al obtener próximo concierto:', err.message);
            return res.status(500).json({ message: 'Error al generar dashboard' });
          }

          dashboard.proximo_concierto_programado = conciertoDTO(proximoResult[0]) || null;

          console.log(`✅ Dashboard generado para usuario ${usuario_id}:`, dashboard);
          res.status(200).json(dashboard);
        });
      });
    });
  });
};

module.exports = { getDashboard };
