const Usuario = require('../models/usuario');

const obtenerPerfil = (req, res) => {
  const { email } = req.usuario; // viene del token decodificado

  Usuario.findByEmail(email, (err, usuario) => {
    if (err) {
      console.error('❌ Error al buscar perfil:', err);
      return res.status(500).json({ message: 'Error al obtener perfil' });
    }

    if (!usuario) {
      console.warn('⚠️ Usuario no encontrado:', email);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      id: usuario.id,
      username: usuario.username,
      email: usuario.email
    });
  });
};

module.exports = { obtenerPerfil };
