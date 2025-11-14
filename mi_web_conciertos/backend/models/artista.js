const db = require('../config/db');

const Artista = {
  create: (nombre, genero, pais_origen, spotify, youtube, pagina_web, drive, usuario_id, callback) => {
    const query = `
      INSERT INTO artistas (nombre, genero, pais_origen, spotify, youtube, pagina_web, drive, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [nombre, genero, pais_origen, spotify, youtube, pagina_web, drive, usuario_id], callback);
  },

  findByUser: (usuario_id, callback) => {
    const query = 'SELECT * FROM artistas WHERE usuario_id = ?';
    db.query(query, [usuario_id], callback);
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM artistas WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Artista;
