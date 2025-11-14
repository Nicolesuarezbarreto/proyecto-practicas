const express = require('express');
const router = express.Router();

const { registrarUsuario, loginUsuario, eliminarUsuario } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
// Rutas protegidas (requieren token)
router.delete('/delete/:id', verificarToken, eliminarUsuario);

module.exports = router;
