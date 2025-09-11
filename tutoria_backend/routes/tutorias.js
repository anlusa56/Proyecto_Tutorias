const express = require("express");
const router = express.Router();
const tutoriaController = require("../controllers/tutoriaController");

router.post("/", tutoriaController.crearTutoria);
router.get("/", tutoriaController.obtenerTutorias);
router.get("/:id", tutoriaController.obtenerTutoriaPorId);
router.delete("/:id", tutoriaController.eliminarTutoria);

module.exports = router;
