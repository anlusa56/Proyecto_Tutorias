const express = require("express");
const router = express.Router();
const { obtenerConfiguracion, actualizarConfiguracion } = require("../controllers/configuracion.controller.js");
const { verificarToken } = require("../middlewares/auth.js");
const checkRol = require("../middlewares/checkRol.js");

// Solo admin puede acceder a configuración
router.use(verificarToken, checkRol(["admin"]));

// Rutas reales de configuración
router.get("/", obtenerConfiguracion);
router.put("/", actualizarConfiguracion);

module.exports = router;



