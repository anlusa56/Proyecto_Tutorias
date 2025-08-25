// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario"); // tu modelo de MongoDB

// Ruta para crear un nuevo usuario
router.post("/", async (req, res) => {
  const { correo, contraseña, rol } = req.body;

  // Validación básica
  if (!correo || !contraseña || !rol) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Usuario ya existe" });
    }

    // Crear el usuario nuevo
    const nuevoUsuario = new Usuario({ correo, contraseña, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

module.exports = router;