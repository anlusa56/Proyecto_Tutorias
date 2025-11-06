const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const { verificarToken } = require('../middlewares/auth');

// Ruta protegida para obtener estadísticas
router.get('/', verificarToken, reporteController.getEstadisticas);

// Add new route for tutor reports
router.get('/tutores', verificarToken, reporteController.getTutorReportes);

module.exports = router;
