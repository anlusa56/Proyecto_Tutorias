const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

// GET: todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-contraseña");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

// GET: un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contraseña");
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar usuario" });
  }
};

// POST: crear nuevo usuario
const crearUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  try {
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ msg: "Correo ya registrado" });

    // Hashear la contraseña antes de guardar
    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hash, rol });
    await nuevoUsuario.save();

    res.status(201).json({ msg: "Usuario creado", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear usuario" });
  }
};

// PUT: actualizar usuario
const actualizarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    usuario.nombre = nombre || usuario.nombre;
    usuario.correo = correo || usuario.correo;
    usuario.rol = rol || usuario.rol;

    if (contraseña) {
      const salt = bcrypt.genSaltSync(10);
      usuario.contraseña = bcrypt.hashSync(contraseña, salt);
    }

    await usuario.save();
    res.json({ msg: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
};

// DELETE: eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
