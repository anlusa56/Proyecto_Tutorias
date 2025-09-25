const { Tutoria, Usuario } = require('../models');

const tutoriaController = {
  // Obtener todas las tutorías según el rol
  getTutoriasByRol: async (req, res) => {
    try {
      const { rol, id } = req.usuario;
      let tutorias;

      switch (rol) {
        case 'admin':
          tutorias = await Tutoria.findAll({
            include: ['profesor', 'tutores', 'tutoriados']
          });
          break;
        case 'profesor':
          tutorias = await Tutoria.findAll({
            where: { profesorId: id },
            include: ['tutores', 'tutoriados']
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
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener tutorías', error });
    }
  },

  // Crear una nueva tutoría
  crearTutoria: async (req, res) => {
    try {
      const { titulo, materia, fecha, horaInicio, horaFin, costoPorHora, tutorId, tutoriadoId } = req.body;
      const profesorId = req.usuario.id;

      const tutoria = await Tutoria.create({
        titulo,
        materia,
        fecha,
        horaInicio,
        horaFin,
        costoPorHora,
        profesorId,
        estado: 'programada'
      });

      if (tutorId) {
        const tutor = await Usuario.findOne({
          where: { id: tutorId, rol: 'estudiante_tutor' }
        });
        if (tutor) await tutoria.addTutor(tutor);
      }

      if (tutoriadoId) {
        const tutoriado = await Usuario.findOne({
          where: { id: tutoriadoId, rol: 'estudiante_tutoriado' }
        });
        if (tutoriado) await tutoria.addTutoriado(tutoriado);
      }

      const tutoriaCompleta = await Tutoria.findByPk(tutoria.id, {
        include: ['profesor', 'tutores', 'tutoriados']
      });

      res.status(201).json(tutoriaCompleta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al crear tutoría', error });
    }
  },

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
      const { tutorId, tutoriadoId, materia, costoPorHora } = req.body;
      const profesorId = req.usuario.id;

      // Validaciones
      if (!tutorId || !tutoriadoId || !materia || !costoPorHora) {
        return res.status(400).json({
          msg: "Faltan campos requeridos"
        });
      }

      // Verificar que el tutor y tutoriado existan y tengan los roles correctos
      const tutor = await Usuario.findOne({
        where: { id: tutorId, rol: 'estudiante_tutor' }
      });
      
      const tutoriado = await Usuario.findOne({
        where: { id: tutoriadoId, rol: 'estudiante_tutoriado' }
      });

      if (!tutor || !tutoriado) {
        return res.status(404).json({
          msg: "Tutor o tutoriado no encontrado"
        });
      }

      // Crear la tutoría
      const tutoria = await Tutoria.create({
        titulo: `Tutoría de ${materia}`,
        materia,
        costoPorHora,
        profesorId,
        estado: 'programada'
      });

      // Asignar tutor y tutoriado
      await tutoria.addTutor(tutor);
      await tutoria.addTutoriado(tutoriado);

      // Obtener la tutoría con las relaciones
      const tutoriaCompleta = await Tutoria.findByPk(tutoria.id, {
        include: ['profesor', 'tutores', 'tutoriados']
      });

      res.status(201).json(tutoriaCompleta);
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
