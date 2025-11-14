require('dotenv').config(); // ✅ Carga las variables del archivo .env
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    console.warn('🚫 Token no proporcionado');
    return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
  }

  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Token inválido:', err.message);
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    req.usuario = decoded; // Guardamos los datos del usuario en la request
    next(); // Continuamos con la ruta protegida
  });
};

module.exports = { verificarToken };
