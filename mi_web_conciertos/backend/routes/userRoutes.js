const express = require('express');
const router = express.Router();
const { obtenerPerfil } = require('../controllers/userController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;
