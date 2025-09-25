const Tutoria = require("../models/Tutoria");
const Usuario = require("../models/Usuario");

// Crear tutoría
const crearTutoria = async (req, res) => {
  try {
    const { titulo, materia, descripcion, fecha, tutores, tutoriados } = req.body;
    const profesorId = req.usuario.id;

    // Validaciones básicas
    if (!titulo || !materia || !fecha) {
      return res.status(400).json({ 
        msg: "Faltan campos requeridos (titulo, materia, fecha)" 
      });
    }

    const tutoria = await Tutoria.create({
      titulo,
      materia,
      descripcion,
      fecha,
      profesorId,
      estado: 'programada'
    });

    // Validar y asignar tutores
    if (tutores && Array.isArray(tutores)) {
      const tutoresValidos = await Usuario.findAll({
        where: { 
          id: tutores,
          rol: 'estudiante_tutor'
        }
      });
      await tutoria.addTutores(tutoresValidos.map(t => t.id));
    }

    // Validar y asignar tutoriados
    if (tutoriados && Array.isArray(tutoriados)) {
      const tutoriadosValidos = await Usuario.findAll({
        where: { 
          id: tutoriados,
          rol: 'estudiante_tutoriado'
        }
      });
      await tutoria.addTutoriados(tutoriadosValidos.map(t => t.id));
    }

    // Retornar tutoría con relaciones
    const tutoriaCompleta = await Tutoria.findByPk(tutoria.id, {
      include: ['profesor', 'tutores', 'tutoriados']
    });

    res.status(201).json(tutoriaCompleta);
  } catch (error) {
    console.error('Error al crear tutoría:', error);
    res.status(500).json({ 
      msg: "Error al crear tutoría",
      error: error.message 
    });
  }
};

// Obtener tutorías por rol
const getTutoriasByRol = async (req, res) => {
  try {
    const usuario = req.usuario;
    let tutorias;

    switch (usuario.rol) {
      case 'admin':
        tutorias = await Tutoria.findAll({
          include: ['profesor', 'tutores', 'tutoriados'],
          order: [['fecha', 'DESC']]
        });
        break;

      case 'profesor':
        tutorias = await Tutoria.findAll({
          where: { profesorId: usuario.id },
          include: ['tutores', 'tutoriados'],
          order: [['fecha', 'DESC']]
        });
        break;

      case 'estudiante_tutor':
        tutorias = await Tutoria.findAll({
          include: [{
            model: Usuario,
            as: 'tutores',
            where: { id: usuario.id }
          }, 'profesor', 'tutoriados'],
          order: [['fecha', 'DESC']]
        });
        break;

      case 'estudiante_tutoriado':
        tutorias = await Tutoria.findAll({
          include: [{
            model: Usuario,
            as: 'tutoriados',
            where: { id: usuario.id }
          }, 'profesor', 'tutores'],
          order: [['fecha', 'DESC']]
        });
        break;

      default:
        return res.status(403).json({ msg: "Rol no autorizado" });
    }

    res.json(tutorias);
  } catch (error) {
    console.error('Error al obtener tutorías:', error);
    res.status(500).json({ 
      msg: "Error al obtener tutorías",
      error: error.message 
    });
  }
};

// Obtener todas las tutorías
const obtenerTutorias = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      include: [
        { model: Usuario, as: "Tutor", attributes: ["id", "nombre", "correo", "rol"] },
        { model: Usuario, as: "Estudiante", attributes: ["id", "nombre", "correo", "rol"] },
      ],
    });
    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tutorías" });
  }
};

// Obtener una tutoría por ID
const obtenerTutoriaPorId = async (req, res) => {
  try {
    const tutoria = await Tutoria.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: "Tutor", attributes: ["id", "nombre", "correo", "rol"] },
        { model: Usuario, as: "Estudiante", attributes: ["id", "nombre", "correo", "rol"] },
      ],
    });

    if (!tutoria) return res.status(404).json({ msg: "Tutoría no encontrada" });

    res.json(tutoria);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tutoría" });
  }
};

// Actualizar tutoría
const actualizarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, materia, descripcion, fecha, estado, tutores, tutoriados } = req.body;

    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ msg: "Tutoría no encontrada" });
    }

    // Verificar permisos
    if (req.usuario.rol !== 'admin' && tutoria.profesorId !== req.usuario.id) {
      return res.status(403).json({ msg: "No autorizado para modificar esta tutoría" });
    }

    await tutoria.update({
      titulo,
      materia,
      descripcion,
      fecha,
      estado
    });

    // Actualizar tutores si se proporcionan
    if (tutores && Array.isArray(tutores)) {
      await tutoria.setTutores(tutores);
    }

    // Actualizar tutoriados si se proporcionan
    if (tutoriados && Array.isArray(tutoriados)) {
      await tutoria.setTutoriados(tutoriados);
    }

    // Retornar tutoría actualizada con relaciones
    const tutoriaActualizada = await Tutoria.findByPk(id, {
      include: ['profesor', 'tutores', 'tutoriados']
    });

    res.json(tutoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar tutoría:', error);
    res.status(500).json({ 
      msg: "Error al actualizar tutoría",
      error: error.message 
    });
  }
};

// Eliminar tutoría
const eliminarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ msg: "Tutoría no encontrada" });
    }

    // Verificar permisos
    if (req.usuario.rol !== 'admin' && tutoria.profesorId !== req.usuario.id) {
      return res.status(403).json({ msg: "No autorizado para eliminar esta tutoría" });
    }

    await tutoria.destroy();
    
    res.json({ msg: "Tutoría eliminada correctamente" });
  } catch (error) {
    console.error('Error al eliminar tutoría:', error);
    res.status(500).json({ 
      msg: "Error al eliminar tutoría",
      error: error.message 
    });
  }
};

module.exports = {
  crearTutoria,
  getTutoriasByRol,
  actualizarTutoria,
  eliminarTutoria,
  obtenerTutorias,
  obtenerTutoriaPorId
};
