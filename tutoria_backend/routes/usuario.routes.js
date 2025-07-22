const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/auth");
const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
} = require("../controllers/usuario.controller");

// Ruta protegida solo para usuarios autenticados
router.get("/",obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", verificarToken, eliminarUsuario);

module.exports = router;
