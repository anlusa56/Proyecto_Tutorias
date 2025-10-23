const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');
const { verificarToken } = require('../middlewares/auth');

// Proteger todas las rutas con verificación de token
router.use(verificarToken);

// Obtener mensajes de una tutoría
router.get('/tutoria/:tutoriaId', mensajeController.getMensajesByTutoria);

// Enviar un mensaje
router.post('/', mensajeController.enviarMensaje);

// Marcar mensaje como leído
router.put('/:mensajeId/leido', mensajeController.marcarComoLeido);

module.exports = router;