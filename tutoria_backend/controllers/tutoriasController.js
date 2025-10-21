const db = require('../models');
const { Usuario, Tutoria } = db;
const { Op } = require('sequelize');

// ✅ Crear tutoría
const crearTutoria = async (req, res) => {
  try {
    const { tutorId, tutoriadoId, materia, fecha, horaInicio, horaFin, observaciones } = req.body;
    const profesorId = req.usuario.id;

    console.log('📥 Datos recibidos para crear tutoría:', {
      tutorId, tutoriadoId, materia, fecha, horaInicio, horaFin, observaciones, profesorId
    });

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

    await Promise.all([
      tutoria.addTutores([tutorId]),
      tutoria.addTutoriados([tutoriadoId])
    ]);

    const tutoriaCompleta = await Tutoria.findByPk(tutoria.id, {
      include: [
        { model: Usuario, as: 'profesor' },
        { model: Usuario, as: 'tutores' },
        { model: Usuario, as: 'tutoriados' }
      ]
    });

    res.status(201).json({
      msg: "✅ Tutoría creada exitosamente",
      tutoria: tutoriaCompleta
    });

  } catch (error) {
    console.error('❌ Error al crear tutoría:', error);
    res.status(500).json({
      msg: "Error al crear tutoría",
      error: error.message
    });
  }
};

// ✅ Obtener tutorías según el rol del usuario
const getTutoriasByRol = async (req, res) => {
  try {
    const { id, rol } = req.usuario;
    let tutorias;

    switch (rol) {
      case 'profesor':
        tutorias = await Tutoria.findAll({
          where: { profesor_id: id },
          include: ['tutores', 'tutoriados']
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
    console.error('❌ Error en getTutoriasByRol:', error);
    res.status(500).json({
      msg: "Error al obtener tutorías",
      error: error.message
    });
  }
};

// ✅ Obtener tutorías del calendario
const getCalendarioTutorias = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      where: {
        [Op.or]: [
          { profesor_id: req.usuario.id },
          { '$tutores.id$': req.usuario.id },
          { '$tutoriados.id$': req.usuario.id }
        ]
      },
      include: [
        { model: Usuario, as: 'profesor', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'tutores', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'tutoriados', attributes: ['id', 'nombre'] }
      ],
      order: [['fecha', 'ASC']]
    });

    res.json(tutorias);
  } catch (error) {
    console.error('❌ Error al obtener calendario:', error);
    res.status(500).json({ msg: 'Error al obtener calendario', error: error.message });
  }
};

// ✅ Asignar tutor a tutoriado
const asignarTutor = async (req, res) => {
  try {
    const { tutorId, tutoriadoId, materia } = req.body;
    const profesorId = req.usuario.id;

    const tutor = await Usuario.findOne({
      where: { id: tutorId, rol: 'estudiante_tutor' }
    });
    if (!tutor) return res.status(400).json({ msg: "El usuario seleccionado no es un tutor válido" });

    const tutoriado = await Usuario.findOne({
      where: { id: tutoriadoId, rol: 'estudiante_tutoriado' }
    });
    if (!tutoriado) return res.status(400).json({ msg: "El usuario seleccionado no es un tutoriado válido" });

    const tutoria = await Tutoria.create({
      profesor_id: profesorId,
      materia,
      estado: 'activa'
    });

    await Promise.all([
      tutoria.addTutores([tutorId]),
      tutoria.addTutoriados([tutoriadoId])
    ]);

    res.status(201).json({ msg: "Tutor asignado exitosamente", tutoria });
  } catch (error) {
    console.error('❌ Error al asignar tutor:', error);
    res.status(500).json({ msg: "Error al asignar tutor", error: error.message });
  }
};

// ✅ Actualizar tutoría
const actualizarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { materia, fecha, hora_inicio, hora_fin, observaciones, estado } = req.body;

    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) return res.status(404).json({ msg: "Tutoría no encontrada" });

    await tutoria.update({
      materia,
      fecha,
      hora_inicio,
      hora_fin,
      observaciones,
      estado
    });

    res.json({ msg: "Tutoría actualizada correctamente", tutoria });
  } catch (error) {
    console.error('❌ Error al actualizar tutoría:', error);
    res.status(500).json({ msg: "Error al actualizar tutoría", error: error.message });
  }
};

// ✅ Eliminar tutoría
const eliminarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const tutoria = await Tutoria.findByPk(id);

    if (!tutoria) return res.status(404).json({ msg: "Tutoría no encontrada" });

    await tutoria.destroy();
    res.json({ msg: "Tutoría eliminada correctamente" });
  } catch (error) {
    console.error('❌ Error al eliminar tutoría:', error);
    res.status(500).json({ msg: "Error al eliminar tutoría", error: error.message });
  }
};
// Controlador: obtener tutorías por profesor
const getTutoriasByProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const tutorias = await Tutoria.findAll({
      where: { profesor_id: id },
      include: [
        { model: Usuario, as: 'tutor' },
        { model: Usuario, as: 'tutoriado' }
      ]
    });

    if (!tutorias.length) {
      return res.status(404).json({ msg: 'No se encontraron tutorías para este profesor' });
    }

    res.json(tutorias);
  } catch (error) {
    console.error('Error al obtener tutorías por profesor:', error);
    res.status(500).json({ msg: 'Error al obtener tutorías del profesor' });
  }
};


// ✅ Exportar todo el controlador
module.exports = {
  crearTutoria,
  getTutoriasByRol,
  getCalendarioTutorias,
  asignarTutor,
  actualizarTutoria,
  eliminarTutoria,
  getTutoriasByProfesor
};
