const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');
const { verificarToken } = require('../middlewares/auth');

router.post('/', verificarToken, mensajeController.enviarMensaje);
router.get('/', verificarToken, mensajeController.obtenerMensajes);
router.patch('/:mensajeId/leido', verificarToken, mensajeController.marcarComoLeido);

module.exports = router;