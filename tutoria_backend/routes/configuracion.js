const express = require('express');
const router = express.Router();
const { obtenerConfiguracion, actualizarConfiguracion } = require('../controllers/configuracion.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT);

router.get('/', obtenerConfiguracion);
router.put('/', actualizarConfiguracion);

module.exports = router;
