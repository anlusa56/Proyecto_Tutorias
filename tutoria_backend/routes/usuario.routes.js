const express = require("express");
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login,
  cambiarEstadoUsuario
} = require("../controllers/usuario.controller");
const { verificarToken } = require("../middlewares/auth");

// Rutas públicas
router.post("/login", login);
router.post("/", crearUsuario);

// Rutas privadas
router.get("/", verificarToken, obtenerUsuarios);
router.get("/:id", verificarToken, obtenerUsuarioPorId);
router.put("/:id", verificarToken, actualizarUsuario);
router.delete("/:id", verificarToken, eliminarUsuario);
router.patch('/:id/estado', verificarToken, cambiarEstadoUsuario);

module.exports = router;
