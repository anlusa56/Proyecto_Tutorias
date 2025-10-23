const express = require('express');
const router = express.Router();
const tutoriadosController = require('../controllers/tutoriadosController');
const { verificarToken } = require('../middlewares/auth');

// Apply verificarToken middleware to all routes
router.use(verificarToken);

// Obtener tutoriados asignados a un tutor
router.get('/tutor/:id', tutoriadosController.getTutoriadosByTutor);

module.exports = router;
