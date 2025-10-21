const db = require('../models');
const { Usuario, Tutoria, sequelize } = db;
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
      tutoria.setTutores([tutorId]),
      tutoria.setTutoriados([tutoriadoId])
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
  const transaction = await sequelize.transaction();
  
  try {
    const { tutorId, tutoriadoId, materia, fecha, hora_inicio, hora_fin, observaciones } = req.body;
    const profesorId = req.usuario.id;

    console.log('📥 [1] Iniciando creación de tutoría con datos:', {
      tutorId, tutoriadoId, materia, fecha, hora_inicio, hora_fin, observaciones, profesorId
    });

    // 1. Crear la tutoría primero
    const tutoria = await Tutoria.create({
      titulo: `Tutoría de ${materia}`,
      materia,
      fecha,
      hora_inicio,
      hora_fin,
      descripcion: observaciones, // Cambiado a descripcion según el modelo
      profesor_id: profesorId,
      estado: 'programada'
    }, { transaction });

    console.log('✅ [2] Tutoría creada con ID:', tutoria.id);

    // 2. Crear las asociaciones usando setTutores y setTutoriados
    await Promise.all([
      tutoria.setTutores([tutorId], { transaction }),
      tutoria.setTutoriados([tutoriadoId], { transaction })
    ]);

    console.log('✅ [3] Asociaciones creadas correctamente');

    // 3. Recuperar la tutoría con todas sus relaciones
    const tutoriaCompleta = await Tutoria.findByPk(tutoria.id, {
      include: [
        { 
          model: Usuario, 
          as: 'profesor',
          attributes: ['id', 'nombre']
        },
        { 
          model: Usuario, 
          as: 'tutores',
          attributes: ['id', 'nombre']
        },
        { 
          model: Usuario, 
          as: 'tutoriados',
          attributes: ['id', 'nombre']
        }
      ],
      transaction
    });

    console.log('✅ [4] Tutoría recuperada con relaciones:', 
      JSON.stringify(tutoriaCompleta, null, 2)
    );

    await transaction.commit();
    console.log('✅ [5] Transacción completada exitosamente');

    res.status(201).json({
      msg: "Tutoría asignada exitosamente",
      tutoria: tutoriaCompleta
    });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error detallado al asignar tutor:', {
      message: error.message,
      stack: error.stack,
      originalError: error.original ? {
        message: error.original.message,
        detail: error.original.detail,
        table: error.original.table,
        constraint: error.original.constraint
      } : null
    });
    
    res.status(500).json({
      msg: "Error al asignar tutor",
      error: error.message,
      details: error.original ? error.original.detail : null
    });
  }
};


// ✅ Actualizar tutoría
const actualizarTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { materia, fecha, hora_inicio, hora_fin, observaciones, estado, } = req.body;

    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) return res.status(404).json({ msg: "Tutoría no encontrada" });

    await tutoria.update({
      titulo: `Tutoría de ${materia}`,
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
        { model: Usuario, as: 'tutores', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'tutoriados', attributes: ['id', 'nombre'] }
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
