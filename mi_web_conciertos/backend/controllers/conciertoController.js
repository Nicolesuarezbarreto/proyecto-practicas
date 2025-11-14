const Concierto = require('../models/concierto');
const db = require('../config/db'); // para validar propiedad del artista

const crearConcierto = (req, res) => {
  const { artista_id, fecha, ciudad, lugar, ticket_url } = req.body;
  const usuario_id = req.usuario.id;

  console.log('🎫 [POST /api/conciertos] Validando datos recibidos:', {
    artista_id,
    fecha,
    ciudad,
    lugar,
    ticket_url,
    usuario_id
  });

  // 1️⃣ Validación de campos obligatorios
  if (!artista_id || !fecha || !ciudad || !lugar || !ticket_url) {
    console.warn('⚠️ Datos incompletos en la solicitud');
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // 2️⃣ Validación de formato de URL
  const urlRegex = /^https:\/\/.+/;
  if (!urlRegex.test(ticket_url)) {
    console.warn('⚠️ URL inválida:', ticket_url);
    return res.status(400).json({ message: 'El ticket_url debe comenzar con https://' });
  }

  // 3️⃣ Validación de propiedad del artista
  const query = 'SELECT * FROM artistas WHERE id = ? AND usuario_id = ?';
  db.query(query, [artista_id, usuario_id], (err, rows) => {
    if (err) {
      console.error('❌ Error al validar artista:', err.message);
      return res.status(500).json({ message: 'Error al validar artista' });
    }

    if (rows.length === 0) {
      console.warn(`🚫 El artista ${artista_id} no pertenece al usuario ${usuario_id}`);
      return res.status(403).json({ message: 'No tenés permiso para usar este artista' });
    }

    // 4️⃣ Crear concierto si todo está validado
    Concierto.create(artista_id, fecha, ciudad, lugar, ticket_url, usuario_id, (err, result) => {
      if (err) {
        console.error('❌ Error al crear concierto:', err.message);
        return res.status(500).json({ message: 'Error al crear concierto' });
      }

      console.log('✅ Concierto creado con ID:', result.insertId);
      res.status(201).json({
        message: 'Concierto creado correctamente',
        id: result.insertId
      });
    });
  });
};

// 🧩 Exportación de funciones
const obtenerConciertos = (req, res) => {
  const usuario_id = req.usuario.id;

  Concierto.findByUser(usuario_id, (err, conciertos) => {
    if (err) {
      console.error('❌ Error al obtener conciertos:', err.message);
      return res.status(500).json({ message: 'Error al obtener conciertos' });
    }

    const resumen = conciertos.map(c => ({
      artista: c.artista_nombre,
      fecha: c.fecha,
      ciudad: c.ciudad,
      lugar: c.lugar,
      ticket_url: c.ticket_url,
      id: c.id,
      created_at: c.created_at
    }));

    console.log(`📋 [GET /api/conciertos] Conciertos del usuario ${usuario_id}:`, resumen);
    res.status(200).json(resumen);
  });
};

const eliminarConcierto = (req, res) => {
  const { id } = req.params;

  console.log(`🗑️ [DELETE /api/conciertos/${id}] Solicitando eliminación de concierto`);

  Concierto.deleteById(id, (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar concierto:', err.message);
      return res.status(500).json({ message: 'Error al eliminar concierto' });
    }

    console.log(`✅ Concierto con ID ${id} eliminado correctamente`);
    res.status(200).json({ message: 'Concierto eliminado correctamente' });
  });
};

module.exports = {
  crearConcierto,
  obtenerConciertos,
  eliminarConcierto
};
