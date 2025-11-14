const express = require('express');
const router = express.Router();
const { crearArtista, obtenerArtistas, eliminarArtista } = require('../controllers/artistaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas protegidas
router.get('/', verificarToken, obtenerArtistas);
router.post('/', verificarToken, crearArtista);
router.delete('/:id', verificarToken, eliminarArtista);


module.exports = router;
