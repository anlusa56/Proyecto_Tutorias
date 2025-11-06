const { Usuario, Tutoria, Mensaje, Avance} = require('../models');
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
// Activar / desactivar usuario
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    usuario.activo = activo;
    await usuario.save();

    res.json({ 
      msg: `Usuario ${activo ? "activado" : "desactivado"} correctamente`,
      usuario: { id: usuario.id, nombre: usuario.nombre, activo: usuario.activo }
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ msg: "Error al cambiar estado del usuario" });
  }
};


// Eliminar usuario
// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [
        { model: Tutoria, as: 'tutoriasComoTutor' },
        { model: Tutoria, as: 'tutoriasComoTutoriado' },
        { model: Tutoria, as: 'tutoriasComoProfesor' },
        { model: Mensaje, as: 'mensajesEnviados' },
        { model: Mensaje, as: 'mensajesRecibidos' },
        { model: Avance, as: 'avances', foreignKey: 'tutoriadoId' } // incluimos avances
      ]
    });

    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Borrar avances del usuario (si los hay)
    if (usuario.avances && usuario.avances.length > 0) {
      await Promise.all(usuario.avances.map(a => a.destroy()));
    }

    // Borrar mensajes enviados
    if (usuario.mensajesEnviados && usuario.mensajesEnviados.length > 0) {
      await Promise.all(usuario.mensajesEnviados.map(m => m.destroy()));
    }

    // Borrar mensajes recibidos
    if (usuario.mensajesRecibidos && usuario.mensajesRecibidos.length > 0) {
      await Promise.all(usuario.mensajesRecibidos.map(m => m.destroy()));
    }

    // Eliminar relaciones con tutorías como tutor y tutoriado
    if (usuario.tutoriasComoTutor && usuario.tutoriasComoTutor.length > 0) {
      await usuario.removeTutoriasComoTutor(usuario.tutoriasComoTutor);
    }
    if (usuario.tutoriasComoTutoriado && usuario.tutoriasComoTutoriado.length > 0) {
      await usuario.removeTutoriasComoTutoriado(usuario.tutoriasComoTutoriado);
    }

    // Borrar tutorías como profesor
    if (usuario.tutoriasComoProfesor && usuario.tutoriasComoProfesor.length > 0) {
      await Promise.all(usuario.tutoriasComoProfesor.map(t => t.destroy()));
    }

    // Finalmente eliminar el usuario
    await usuario.destroy();

    res.json({ msg: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor", error: error.message });
  }
};

// Login (devuelve token)
const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    console.log('Intentando login con:', { correo });

    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Si no es admin y no está activo → denegar acceso
    if (usuario.rol !== 'admin' && !usuario.activo) {
      return res.status(403).json({ msg: "Tu cuenta aún no ha sido activada por el administrador" });
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
        rol: usuario.rol,
        activo: usuario.activo
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
  cambiarEstadoUsuario
};

