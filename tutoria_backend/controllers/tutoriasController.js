const db = require('../models');
const { Usuario, Tutoria, sequelize } = db;
const { Op } = require('sequelize');
const { configuracion } = require('./configuracion.controller');

// ✅ Crear tutoría con validaciones y configuración
const crearTutoria = async (req, res) => {
  try {
    const { materia, fecha, hora_inicio, hora_fin, observaciones, profesor_id, tutor_id, tutoriado_id } = req.body;

    // Cargar configuración actual
    let configuracion = null;
    try {
      configuracion = require('./configuracion.controller').configuracion;
    } catch (err) {
      console.warn('⚠️ No se pudo cargar configuración, usando valores por defecto.');
    }

    // Si existe configuración de duración, recalcular hora_fin
    let horaFinFinal = hora_fin;
    if (configuracion?.duracion_tutoria && hora_inicio) {
      const [h, m] = hora_inicio.split(':').map(Number);
      const fin = new Date(0, 0, 0, h, m + configuracion.duracion_tutoria);
      horaFinFinal = fin.toTimeString().slice(0, 5);
    }

    // 🔍 Validar conflicto de horario (mismo tutor o tutoriado)
    const conflicto = await Tutoria.findOne({
      where: {
        fecha,
        [Op.or]: [
          { profesor_id },
          sequelize.literal(`EXISTS (SELECT 1 FROM tutores_tutorias tt WHERE tt.tutoria_id = Tutoria.id AND tt.usuario_id = ${tutor_id})`),
          sequelize.literal(`EXISTS (SELECT 1 FROM tutoriados_tutorias td WHERE td.tutoria_id = Tutoria.id AND td.usuario_id = ${tutoriado_id})`)
        ],
        [Op.and]: [
          { hora_inicio: { [Op.lt]: horaFinFinal } },
          { hora_fin: { [Op.gt]: hora_inicio } }
        ]
      }
    });

    if (conflicto) {
      return res.status(400).json({
        msg: '⚠️ Ya existe una tutoría en ese horario para el mismo tutor o tutoriado.'
      });
    }

    // Crear tutoría si no hay conflicto
    const tutoria = await Tutoria.create({
      titulo: `Tutoría de ${materia}`,
      materia,
      fecha,
      hora_inicio,
      hora_fin: horaFinFinal,
      observaciones,
      estado: 'programada',
      profesor_id
    });

    res.status(201).json({
      msg: '✅ Tutoría creada correctamente',
      tutoria
    });

  } catch (error) {
    console.error('❌ Error al crear la tutoría:', error);
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

// ✅ Asignar tutoría aplicando configuración y validando duración exacta
const asignarTutoria = async (req, res) => {
  let transaction;

  try {
    if (!req.usuario || req.usuario.rol !== 'profesor') {
      return res.status(403).json({ msg: 'Solo los profesores pueden asignar tutorías.' });
    }

    const profesor_id = req.usuario.id;
    const { tutor_id, tutoriado_id, materia, fecha, hora_inicio, hora_fin, observaciones } = req.body;

    // 🔧 Cargar configuración actual
    let configuracion = null;
    try {
      configuracion = require('./configuracion.controller').configuracion;
    } catch (err) {
      console.warn('⚠️ No se pudo cargar configuración, usando valores por defecto.');
    }

    // Verificar duración configurada
    const duracionAdmin = configuracion?.duracion_tutoria;
    if (!duracionAdmin || duracionAdmin < 30 || duracionAdmin > 120) {
      return res.status(400).json({
        msg: 'La duración configurada por el administrador debe estar entre 30 y 120 minutos.'
      });
    }

    // ⏰ Calcular duración ingresada por el profesor
    if (!hora_inicio || !hora_fin) {
      return res.status(400).json({ msg: 'Debe especificar hora de inicio y fin.' });
    }

    const [h1, m1] = hora_inicio.split(':').map(Number);
    const [h2, m2] = hora_fin.split(':').map(Number);
    const minutosCalculados = (h2 * 60 + m2) - (h1 * 60 + m1);

    // ⛔ Validar duración exacta según config
    if (minutosCalculados !== duracionAdmin) {
      return res.status(400).json({
        msg: `La duración predeterminada de la tutoría debe ser de ${duracionAdmin} minutos según la configuración del administrador.`
      });
    }

    transaction = await sequelize.transaction();

    // ✅ Crear la tutoría
    const tutoria = await Tutoria.create({
      titulo: `Tutoría de ${materia}`,
      materia,
      fecha,
      hora_inicio,
      hora_fin,
      observaciones,
      estado: 'programada',
      profesor_id
    }, { transaction });

    // ✅ Relacionar tutor y tutoriado
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
      msg: `Tutoría asignada correctamente con duración de ${duracionAdmin} minutos.`,
      tutoria
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('❌ Error en asignarTutoria:', error);
    res.status(500).json({
      msg: 'Error al asignar tutoría',
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
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    
    console.log('🗑️ Intentando eliminar tutoría:', id);

    // 1. Primero eliminar los mensajes asociados
    await sequelize.models.Mensaje.destroy({
      where: { tutoria_id: id },
      transaction
    });

    // 2. Eliminar registros de las tablas intermedias
    await sequelize.models.tutores_tutorias.destroy({
      where: { tutoria_id: id },
      transaction
    });

    await sequelize.models.tutoriados_tutorias.destroy({
      where: { tutoria_id: id },
      transaction
    });

    // 3. Finalmente eliminar la tutoría
    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Tutoría no encontrada" });
    }

    await tutoria.destroy({ transaction });
    await transaction.commit();

    console.log('✅ Tutoría y registros relacionados eliminados correctamente');
    res.json({ msg: "Tutoría eliminada correctamente" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('❌ Error al eliminar tutoría:', error);
    res.status(500).json({ 
      msg: "Error al eliminar tutoría", 
      error: error.message 
    });
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
    console.log("🔍 Buscando tutorías para el tutor:", id);

    const tutorias = await db.Tutoria.findAll({
      include: [
        {
          model: db.Usuario,
          as: "tutoriasComoTutor", // 👈 alias exacto del modelo Tutoria
          where: { id },
          attributes: ["id", "nombre", "correo"],
          through: { attributes: [] },
          required: true
        },
        {
          model: db.Usuario,
          as: "tutoriasComoTutoriado", // 👈 alias exacto del modelo Tutoria
          attributes: ["id", "nombre", "correo"],
          through: { attributes: [] },
          required: false
        },
        {
          model: db.Usuario,
          as: "profesor",
          attributes: ["id", "nombre", "correo"],
          required: false
        }
      ],
      attributes: [
        "id",
        "titulo",
        "materia",
        "fecha",
        "hora_inicio",
        "hora_fin",
        "estado"
      ]
    });

    console.log("✅ Tutorías encontradas:", tutorias.length);
    res.json(tutorias);
  } catch (error) {
    console.error("❌ Error al obtener tutorías del tutor:", {
      error: error.message,
      stack: error.stack,
      tutorId: req.params.id
    });
    res.status(500).json({ error: error.message });
  }
};
// Controlador: obtener tutorías por tutoriado
const getTutoriasByTutoriado = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Buscando tutorías para el tutoriado:", id);

    const tutorias = await db.Tutoria.findAll({
      include: [
        {
          model: db.Usuario,
          as: "tutoriasComoTutoriado", // alias exacto definido en Tutoria.js
          where: { id },
          attributes: ["id", "nombre", "correo"],
          through: { attributes: [] },
          required: true
        },
        {
          model: db.Usuario,
          as: "tutoriasComoTutor", // alias del tutor
          attributes: ["id", "nombre", "correo"],
          through: { attributes: [] },
          required: false
        },
        {
          model: db.Usuario,
          as: "profesor",
          attributes: ["id", "nombre", "correo"],
          required: false
        }
      ],
      attributes: [
        "id",
        "titulo",
        "materia",
        "fecha",
        "hora_inicio",
        "hora_fin",
        "estado"
      ],
      order: [["fecha", "DESC"]]
    });

    console.log("✅ Tutorías encontradas:", tutorias.length);
    res.json(tutorias);
  } catch (error) {
    console.error("❌ Error al obtener tutorías del tutoriado:", {
      error: error.message,
      stack: error.stack,
      tutoriadoId: req.params.id
    });
    res.status(500).json({ error: error.message });
  }
};
// ✅ Cambiar solo el estado de una tutoría
const actualizarEstadoTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    console.log('📝 Actualizando estado de tutoría:', { id, estado });

    const tutoria = await Tutoria.findByPk(id);
    
    if (!tutoria) {
      console.log('❌ Tutoría no encontrada:', id);
      return res.status(404).json({ msg: "Tutoría no encontrada" });
    }

    // Validar estado permitido
    const estadosPermitidos = ['programada', 'en_curso', 'completada', 'cancelada'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ 
        msg: "Estado no válido",
        estadosPermitidos 
      });
    }

    await tutoria.update({ estado });
    
    // Obtener la tutoría actualizada con sus relaciones
    const tutoriaActualizada = await Tutoria.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'tutoriasComoTutor',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        },
        {
          model: Usuario,
          as: 'tutoriasComoTutoriado',
          attributes: ['id', 'nombre'],
          through: { attributes: [] }
        }
      ]
    });

    console.log('✅ Estado actualizado correctamente:', estado);

    res.json({ 
      msg: `Estado actualizado a '${estado}' correctamente`, 
      tutoria: tutoriaActualizada 
    });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ 
      msg: "Error al actualizar estado", 
      error: error.message 
    });
  }
};
// ✅ Cambiar estado de una tutoría
const updateTutoriaEstado = async (req, res) => {
  try {
    const { id } = req.params; // ID de la tutoría
    const { estado } = req.body; // Nuevo estado enviado desde el frontend

    // Validar que el campo 'estado' exista
    if (!estado) {
      return res.status(400).json({ msg: "El campo 'estado' es obligatorio" });
    }

    // Buscar la tutoría en la base de datos
    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ msg: "Tutoría no encontrada" });
    }

    // Actualizar el estado
    tutoria.estado = estado;
    await tutoria.save();

    return res.json({
      msg: "Estado actualizado correctamente",
      tutoria,
    });
  } catch (error) {
    console.error("❌ Error al actualizar estado de tutoría:", error);
    return res.status(500).json({
      msg: "Error al actualizar el estado de la tutoría",
      error: error.message,
    });
  }
};
// ✅ Cancelar tutoría con validación según configuración del administrador
const cancelarTutoria = async (req, res) => {
  try {
    const { id } = req.params; // ID de la tutoría
    const usuarioId = req.usuario.id;
    const rol = req.usuario.rol;

    // 🔍 Buscar la tutoría
    const tutoria = await Tutoria.findByPk(id);
    if (!tutoria) {
      return res.status(404).json({ msg: 'Tutoría no encontrada.' });
    }

    // 🔒 Validar que el usuario sea tutor o tutoriado asignado
    const esTutor = await sequelize.models.tutores_tutorias.findOne({
      where: { tutoria_id: id, usuario_id: usuarioId }
    });
    const esTutoriado = await sequelize.models.tutoriados_tutorias.findOne({
      where: { tutoria_id: id, usuario_id: usuarioId }
    });

    if (!esTutor && !esTutoriado) {
      return res.status(403).json({ msg: 'No tienes permiso para cancelar esta tutoría.' });
    }

    // ⚙️ Cargar configuración
    let configuracion = null;
    try {
      configuracion = require('./configuracion.controller').configuracion;
    } catch (err) {
      console.warn('⚠️ No se pudo cargar configuración, usando valores por defecto.');
    }

    const diasAntelacion = configuracion?.dias_cancelacion ?? 1; // Por defecto 1 día
    const fechaTutoria = new Date(tutoria.fecha);
    const hoy = new Date();

    // Calcular diferencia en días
    const diffTiempo = fechaTutoria - hoy;
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));

    if (diffDias < diasAntelacion) {
      return res.status(400).json({
        msg: `Solo puedes cancelar una tutoría con al menos ${diasAntelacion} días de antelación.`
      });
    }

    // ✅ Cambiar estado
    tutoria.estado = 'cancelada';
    await tutoria.save();

    res.json({
      msg: `Tutoría cancelada correctamente.`,
      estado: tutoria.estado
    });

  } catch (error) {
    console.error('❌ Error al cancelar tutoría:', error);
    res.status(500).json({
      msg: 'Error al cancelar tutoría.',
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
  getTutoriasByTutoriado,
  actualizarEstadoTutoria,
  updateTutoriaEstado,
  cancelarTutoria,
};
