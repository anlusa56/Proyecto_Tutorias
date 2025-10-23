const db = require('../models');
const { Usuario, Tutoria, sequelize } = db;
const { Op } = require('sequelize');

// ✅ Crear tutoría
const crearTutoria = async (req, res) => {
  try {
    const { materia, fecha, hora_inicio, hora_fin, observaciones } = req.body;
    
    const tutoria = await Tutoria.create({
      titulo: `Tutoría de ${materia}`, // Agregamos el título automáticamente
      materia,
      fecha,
      hora_inicio,
      hora_fin,
      observaciones,
      estado: 'programada'
    });

    res.status(201).json(tutoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear la tutoría',
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
          include: [
            { 
              model: Usuario, 
              as: 'tutoriasComoTutor', 
              attributes: ['id', 'nombre'],
              required: true 
            },
            { 
              model: Usuario, 
              as: 'tutoriasComoTutoriado', 
              attributes: ['id', 'nombre'],
              required: true 
            }
          ]
        });
        break;
      case 'admin':
        tutorias = await Tutoria.findAll({
          include: [
            { model: Usuario, as: 'profesor', attributes: ['id', 'nombre'] },
            { model: Usuario, as: 'tutoriasComoTutor', attributes: ['id', 'nombre'] },
            { model: Usuario, as: 'tutoriasComoTutoriado', attributes: ['id', 'nombre'] }
          ]
        });
        break;
      case 'estudiante_tutor':
        tutorias = await Tutoria.findAll({
          include: [{
            model: Usuario,
            as: 'tutoriasComoTutor',
            where: { id },
            attributes: ['id', 'nombre']
          }]
        });
        break;
      case 'estudiante_tutoriado':
        tutorias = await Tutoria.findAll({
          include: [{
            model: Usuario,
            as: 'tutoriasComoTutoriado',
            where: { id },
            attributes: ['id', 'nombre']
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
          { '$tutoriasComoTutor.id$': req.usuario.id },
          { '$tutoriasComoTutoriado.id$': req.usuario.id }
        ]
      },
      include: [
        { 
          model: Usuario, 
          as: 'profesor', 
          attributes: ['id', 'nombre'],
          required: true 
        },
        { 
          model: Usuario, 
          as: 'tutoriasComoTutor', 
          attributes: ['id', 'nombre'], 
          through: { attributes: [] },
          required: true 
        },
        { 
          model: Usuario, 
          as: 'tutoriasComoTutoriado', 
          attributes: ['id', 'nombre'], 
          through: { attributes: [] },
          required: true 
        }
      ],
      order: [['fecha', 'ASC']]
    });

    res.json(tutorias);
  } catch (error) {
    console.error('❌ Error al obtener calendario:', error);
    res.status(500).json({ 
      msg: 'Error al obtener calendario', 
      error: error.message 
    });
  }
};

// ✅ Asignar tutor a tutoriado
const asignarTutoria = async (req, res) => {
  let transaction;

  try {
    // Verifica que el usuario autenticado sea un profesor
    if (!req.usuario || req.usuario.rol !== 'profesor') {
      return res.status(403).json({ msg: 'Solo los profesores pueden asignar tutorías.' });
    }

    const profesor_id = req.usuario.id; // 👈 se obtiene del token JWT
    const { tutor_id, tutoriado_id, materia, fecha, hora_inicio, hora_fin, observaciones } = req.body;

    transaction = await sequelize.transaction();

    // ✅ Crear la tutoría con profesor_id
    const tutoria = await Tutoria.create({
      titulo: `Tutoría de ${materia}`,
      materia,
      fecha,
      hora_inicio,
      hora_fin,
      observaciones,
      estado: 'programada',
      profesor_id // 👈 aquí está la clave
    }, { transaction });

    // ✅ Crear las relaciones tutor-tutoriado
    await Promise.all([
      sequelize.models.tutores_tutorias.create({
        tutoria_id: tutoria.id,
        usuario_id: tutor_id
      }, { transaction }),
      sequelize.models.tutoriados_tutorias.create({
        tutoria_id: tutoria.id,
        usuario_id: tutoriado_id
      }, { transaction })
    ]);

    await transaction.commit();

    res.status(201).json({
      msg: 'Tutoría creada y asignada correctamente',
      tutoria
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('❌ Error en asignarTutoria:', error);
    res.status(500).json({
      msg: 'Error al asignar tutor',
      error: error.message
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
        {
          model: Usuario,
          as: 'profesor',
          attributes: ['id', 'nombre', 'correo']
        },
        {
          model: Usuario,
          as: 'tutoriasComoTutor',
          through: { attributes: [] },
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'tutoriasComoTutoriado',
          through: { attributes: [] },
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json(tutorias);
  } catch (error) {
    console.error('❌ Error al obtener tutorías por profesor:', error);
    res.status(500).json({
      msg: 'Error al obtener tutorías del profesor',
      error: error.message
    });
  }
};


// Controlador: obtener tutorías por tutor
const getTutoriasByTutor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando tutorías para el tutor:', id);

    const tutorias = await Tutoria.findAll({
      include: [
        { 
          model: Usuario, 
          as: 'tutoriasComoTutor',
          where: { id },
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'tutoriasComoTutoriado',
          attributes: ['id', 'nombre', 'correo']
        },
        {
          model: Usuario,
          as: 'profesor',
          attributes: ['id', 'nombre']
        }
      ],
      attributes: [
        'id', 'titulo', 'materia', 'descripcion', 
        'fecha', 'hora_inicio', 'hora_fin', 'estado'
      ]
    });

    console.log('✅ Tutorías encontradas:', tutorias.length);

    if (tutorias.length === 0) {
      return res.status(404).json({
        msg: 'No se encontraron tutorías para este tutor',
        debug: { tutorId: id }
      });
    }

    res.json(tutorias);
  } catch (error) {
    console.error('❌ Error al obtener tutorías del tutor:', {
      error: error.message,
      stack: error.stack,
      tutorId: req.params.id
    });
    res.status(500).json({ 
      msg: 'Error al obtener tutorías',
      error: error.message 
    });
  }
};

// ✅ Exportar todo el controlador
module.exports = {
  crearTutoria,
  getTutoriasByRol,
  getCalendarioTutorias,
  asignarTutoria,
  actualizarTutoria,
  eliminarTutoria,
  getTutoriasByProfesor,
  getTutoriasByTutor,
};
