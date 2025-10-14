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
const { verificarToken } = require("../middlewares/auth"); // Añadimos esta importación

// Rutas públicas
router.post("/login", login);
router.post("/", crearUsuario);

// Rutas que requieren autenticación
router.get("/", verificarToken, obtenerUsuarios);
router.get("/:id", verificarToken, obtenerUsuarioPorId);
router.put("/:id", verificarToken, actualizarUsuario);
router.delete("/:id", verificarToken, eliminarUsuario);

module.exports = router;