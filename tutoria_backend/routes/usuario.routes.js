const express = require("express");
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login
} = require("../controllers/usuario.controller");

// Rutas públicas
router.post("/login", login);
router.post("/login", login);
router.post("/", crearUsuario);

// Rutas que requieren autenticación
router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;