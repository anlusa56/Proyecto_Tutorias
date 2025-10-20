const express = require("express");
const router = express.Router();
const { obtenerTutoriadosPorTutor } = require("../controllers/tutoriadosController.js");

// Ruta para obtener tutoriados de un tutor específico
router.get("/tutor/:idTutor", obtenerTutoriadosPorTutor);

module.exports = router;
