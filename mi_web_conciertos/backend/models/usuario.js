const db = require('../config/db');

const Usuario = {
  create: (username, email, password, callback) => {
    const query = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], callback);
  },

  findByEmail: (email, callback) => {
    console.log('🔎 Buscando usuario por email en la base:', email);
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) return callback(err);

      if (results.length === 0) {
        console.warn('⚠️ No se encontró ningún usuario con ese email');
        return callback(null, null);
      }

      console.log('✅ Usuario encontrado:', results[0]); // ← log agregado
      callback(null, results[0]);
    });
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Usuario;

