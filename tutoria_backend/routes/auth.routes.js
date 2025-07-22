const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ msg: "Ya existe un usuario con ese correo" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(contraseña, salt);

    const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hash, rol });
    await nuevoUsuario.save();

    // Generar token para el nuevo usuario
    const token = jwt.sign(
      { id: nuevoUsuario._id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      msg: "Usuario creado correctamente",
      token,
      usuario: { nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    const valid = bcrypt.compareSync(contraseña, usuario.contraseña);
    if (!valid) return res.status(401).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ token, usuario: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
});

// GET /api/usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "-contraseña"); // No enviar la contraseña
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
});

module.exports = router;
