const db = require('../config/db');

const Concierto = {
  create: (artista_id, fecha, ciudad, lugar, ticket_url, usuario_id, callback) => {
    const query = `
      INSERT INTO conciertos (artista_id, fecha, ciudad, lugar, ticket_url, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [artista_id, fecha, ciudad, lugar, ticket_url, usuario_id], callback);
  },

  findByUser: (usuario_id, callback) => {
    const query = `
      SELECT c.*, a.nombre AS artista_nombre
      FROM conciertos c
      JOIN artistas a ON c.artista_id = a.id
      WHERE c.usuario_id = ?
      ORDER BY c.fecha ASC
    `;
    db.query(query, [usuario_id], callback);
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM conciertos WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Concierto;
