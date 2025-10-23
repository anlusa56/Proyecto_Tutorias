const express = require('express');
const router = express.Router();
const avancesController = require('../controllers/avancesController');
const { verificarToken } = require('../middlewares/auth');

// Middleware de autenticación para todas las rutas
router.use(verificarToken);

// Registrar un nuevo avance (solo tutores)
router.post('/', avancesController.registrarAvance);

// Obtener avances por tutor
router.get('/tutor', avancesController.obtenerAvancesTutor);

// Obtener avances por tutoriado
router.get('/tutoriado', avancesController.obtenerAvancesTutoriado);

module.exports = router;