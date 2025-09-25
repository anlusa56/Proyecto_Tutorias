const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ["contraseña"] } });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ 
      msg: "Error al obtener usuarios",
      error: error.message 
    });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: { exclude: ["contraseña"] } });
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuario" });
  }
};

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) return res.status(400).json({ msg: "Correo ya registrado" });

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({ nombre, correo, contraseña: hash, rol });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear usuario" });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.update(req.body, { where: { id: req.params.id }, returning: true });
    res.json(usuario[1][0]);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.destroy({ where: { id: req.params.id } });
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

// Login (devuelve token)
const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    console.log('Intento de login:', correo);

    const usuario = await Usuario.findOne({ 
      where: { correo } 
    });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    
    if (!valido) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        rol: usuario.rol,
        nombre: usuario.nombre 
      },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      msg: "Error en el servidor",
      error: error.message 
    });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login,
};
