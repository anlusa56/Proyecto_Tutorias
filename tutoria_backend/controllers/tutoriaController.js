const db = require('../models');
const { Usuario, Tutoria } = db;

const crearTutoria = async (req, res) => {
  try {
    const { tutorId, tutoriadoId, materia, fecha, horaInicio, horaFin, observaciones } = req.body;
    const profesorId = req.usuario.id;

    console.log('Datos recibidos:', {
      tutorId, tutoriadoId, materia, fecha, horaInicio, horaFin, observaciones, profesorId
    });

    // Crear la tutoría
    const tutoria = await Tutoria.create({
      titulo: `Tutoría de ${materia}`,
      materia,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      observaciones,
      profesor_id: profesorId,
      estado: 'programada'
    });

    // Agregar las relaciones
    await Promise.all([
      tutoria.addTutores([tutorId]),
      tutoria.addTutoriados([tutoriadoId])
    ]);

    // Obtener la tutoría con sus relaciones
    const tutoriaCompleta = await Tutoria.findByPk(tutoria.id, {
      include: [
        { model: Usuario, as: 'profesor' },
        { model: Usuario, as: 'tutores' },
        { model: Usuario, as: 'tutoriados' }
      ]
    });

    res.status(201).json({
      msg: "Tutoría creada exitosamente",
      tutoria: tutoriaCompleta
    });

  } catch (error) {
    console.error('Error al crear tutoría:', error);
    res.status(500).json({
      msg: "Error al crear tutoría",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const tutoriaController = {
  // Obtener todas las tutorías según el rol
  getTutoriasByRol: async (req, res) => {
    try {
      console.log('Usuario solicitando tutorías:', req.usuario); // Debug
      const { id, rol } = req.usuario;

      let tutorias;
      switch (rol) {
        case 'profesor':
          tutorias = await Tutoria.findAll({
            where: { profesor_id: id },
            include: [
              { model: Usuario, as: 'tutores' },
              { model: Usuario, as: 'tutoriados' }
            ]
          });
          break;
        case 'admin':
          tutorias = await Tutoria.findAll({
            include: ['profesor', 'tutores', 'tutoriados']
          });
          break;
        case 'estudiante_tutor':
          tutorias = await Tutoria.findAll({
            include: [{
              model: Usuario,
              as: 'tutores',
              where: { id }
            }]
          });
          break;
        case 'estudiante_tutoriado':
          tutorias = await Tutoria.findAll({
            include: [{
              model: Usuario,
              as: 'tutoriados',
              where: { id }
            }]
          });
          break;
        default:
          return res.status(403).json({ msg: 'Rol no autorizado' });
      }

      res.json(tutorias);
    } catch (error) {
      console.error('Error en getTutoriasByRol:', error);
      res.status(500).json({
        msg: "Error al obtener tutorías",
        error: error.message
      });
    }
  },

  // Crear una nueva tutoría
  crearTutoria,

  // Obtener todas las tutorías
  obtenerTutorias: async (req, res) => {
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
  },

  // Obtener una tutoría por ID
  obtenerTutoriaPorId: async (req, res) => {
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
  },

  // Actualizar tutoría
  actualizarTutoria: async (req, res) => {
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
  },

  // Eliminar tutoría
  eliminarTutoria: async (req, res) => {
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
  },

  // Asignar tutor
  asignarTutor: async (req, res) => {
    try {
      const { tutorId, tutoriadoId, materia } = req.body;
      const profesorId = req.usuario.id;

      // Validar que el tutor sea efectivamente un tutor
      const tutor = await Usuario.findOne({
        where: { 
          id: tutorId,
          rol: 'estudiante_tutor'
        }
      });

      if (!tutor) {
        return res.status(400).json({ msg: "El usuario seleccionado no es un tutor válido" });
      }

      // Validar que el tutoriado no tenga ya un tutor asignado
      const tutoriado = await Usuario.findOne({
        where: { 
          id: tutoriadoId,
          rol: 'estudiante_tutoriado'
        }
      });

      if (!tutoriado) {
        return res.status(400).json({ msg: "El usuario seleccionado no es un tutoriado válido" });
      }

      // Crear la asignación
      const tutoria = await Tutoria.create({
        tutorId,
        tutoriadoId,
        profesorId,
        materia,
        estado: 'activa'
      });

      res.status(201).json({
        msg: "Tutor asignado exitosamente",
        tutoria
      });

    } catch (error) {
      console.error('Error al asignar tutor:', error);
      res.status(500).json({
        msg: "Error al asignar tutor",
        error: error.message
      });
    }
  }
};

module.exports = tutoriaController;
