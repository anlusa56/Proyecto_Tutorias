const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const { verificarToken } = require('../middlewares/auth');
const { esAdmin } = require('../middlewares/validar-roles');

// Aplicar middlewares
router.use(verificarToken);
router.use(esAdmin);

router.get('/', solicitudController.getSolicitudesPendientes);
router.put('/:id/aprobar', solicitudController.aprobarSolicitud);
router.delete('/:id', solicitudController.rechazarSolicitud);
router.put('/aprobar-todas', solicitudController.aprobarTodas);
router.delete('/rechazar-todas', solicitudController.rechazarTodas);

module.exports = router;
