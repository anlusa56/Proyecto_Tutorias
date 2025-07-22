const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

// GET /api/usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "-contraseña"); // No enviar la contraseña
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
});

// Eliminar usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
});

module.exports = router;