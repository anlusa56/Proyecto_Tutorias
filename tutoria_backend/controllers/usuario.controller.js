const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;
    const whereClause = {};
    
    if (rol) {
      whereClause.rol = rol;
    }

    const usuarios = await Usuario.findAll({
      where: whereClause,
      attributes: { 
        exclude: ['contraseña']
      }
    });

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
    const { nombre, correo, password, rol } = req.body;
    console.log("Datos recibidos:", { nombre, correo, rol });

    const usuarioExistente = await Usuario.findOne({ 
      where: { correo } 
    });

    if (usuarioExistente) {
      return res.status(400).json({ 
        msg: "El correo ya está registrado" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contraseña: hashedPassword, // Cambiado a contraseña
      rol
    });

    res.status(201).json({
      msg: "Usuario creado exitosamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      msg: "Error al crear usuario",
      error: error.message
    });
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
    const { correo } = req.body;
    console.log('Intentando login con:', { correo });

    const usuario = await Usuario.findOne({ 
      where: { correo }
    });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const valido = await bcrypt.compare(req.body.contraseña, usuario.contraseña);
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
