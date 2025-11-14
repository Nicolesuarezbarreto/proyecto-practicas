const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

// 🔒 Dashboard protegido
router.get('/', verificarToken, getDashboard);

module.exports = router;
