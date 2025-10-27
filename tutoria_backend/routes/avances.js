// routes/avances.js
const express = require("express");
const router = express.Router();
const avanceController = require("../controllers/avanceController");

// Registrar un avance
router.post("/", avanceController.crearAvance);

// Obtener todos los avances
router.get("/", avanceController.obtenerAvances);

// Obtener avances por tutoría específica
router.get("/tutoria/:id", avanceController.obtenerAvancesPorTutoria);

// Obtener avances por tutoriado
router.get("/tutoriado/:id", avanceController.obtenerAvancesPorTutoriado);

module.exports = router;
