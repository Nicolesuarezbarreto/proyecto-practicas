const Artista = require('../models/artista');

const crearArtista = (req, res) => {
  const { nombre, genero, pais_origen, spotify, youtube, pagina_web, drive } = req.body;
  const usuario_id = req.usuario.id; // ← capturamos el ID del usuario autenticado

  console.log('🎨 [POST /api/artistas] Creando artista con datos:', {
    nombre,
    genero,
    pais_origen,
    usuario_id
  });

  Artista.create(nombre, genero, pais_origen, spotify, youtube, pagina_web, drive, usuario_id, (err, result) => {
    if (err) {
      console.error('❌ Error al crear artista:', err.message);
      return res.status(500).json({ message: 'Error al crear artista' });
    }

    console.log('✅ Artista creado con ID:', result.insertId);
    console.log('🧾 Datos principales del artista creado:', {
      id: result.insertId,
      nombre,
      genero,
      pais_origen,
      usuario_id
    });

    res.status(201).json({
      message: 'Artista creado correctamente',
      id: result.insertId
    });
  });
};

const obtenerArtistas = (req, res) => {
  const usuario_id = req.usuario.id; // ← filtramos por el usuario autenticado

  Artista.findByUser(usuario_id, (err, artistas) => {
    if (err) {
      console.error('❌ Error al obtener artistas:', err.message);
      return res.status(500).json({ message: 'Error al obtener artistas' });
    }

    const resumen = artistas.map(a => ({
      id: a.id,
      nombre: a.nombre,
      genero: a.genero,
      pais_origen: a.pais_origen
    }));

    console.log(`📋 [GET /api/artistas] Artistas del usuario ${usuario_id}:`, resumen);
    res.status(200).json(artistas);
  });
};

const eliminarArtista = (req, res) => {
  const { id } = req.params;

  console.log(`🗑️ [DELETE /api/artistas/${id}] Solicitando eliminación de artista`);

  Artista.deleteById(id, (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar artista:', err.message);
      return res.status(500).json({ message: 'Error al eliminar artista' });
    }

    console.log(`✅ Artista con ID ${id} eliminado correctamente`);
    res.status(200).json({ message: 'Artista eliminado correctamente' });
  });
};

module.exports = { crearArtista, obtenerArtistas, eliminarArtista };
