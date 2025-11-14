const express = require('express');
const router = express.Router();
const { crearConcierto, obtenerConciertos, eliminarConcierto } = require('../controllers/conciertoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearConcierto);
router.get('/', verificarToken, obtenerConciertos);
router.delete('/:id', verificarToken, eliminarConcierto);

module.exports = router;
