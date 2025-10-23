const { Usuario, Avance } = require('../models');

const registrarAvance = async (req, res) => {
  try {
    const { tutoriadoId, fecha, tema, descripcion, calificacion, observaciones } = req.body;
    const tutorId = req.usuario.id;

    console.log('📝 Registrando avance:', {
      tutorId,
      tutoriadoId,
      fecha,
      tema,
      calificacion
    });

    // Verificar que el usuario es un tutor
    if (req.usuario.rol !== 'estudiante_tutor') {
      return res.status(403).json({ msg: 'No autorizado - Solo tutores pueden registrar avances' });
    }

    // Crear el avance
    const avance = await Avance.create({
      tutorId,
      tutoriadoId,
      fecha,
      tema,
      descripcion,
      calificacion,
      observaciones
    });

    // Obtener el avance con las relaciones
    const avanceConRelaciones = await Avance.findByPk(avance.id, {
      include: [
        {
          model: Usuario,
          as: 'tutoriado',
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'tutor',
          attributes: ['id', 'nombre']
        }
      ]
    });

    res.status(201).json({
      msg: 'Avance registrado exitosamente',
      avance: avanceConRelaciones
    });

  } catch (error) {
    console.error('❌ Error al registrar avance:', error);
    res.status(500).json({
      msg: 'Error al registrar avance',
      error: error.message
    });
  }
};

const obtenerAvancesTutor = async (req, res) => {
  try {
    const tutorId = req.usuario.id;
    
    const avances = await Avance.findAll({
      where: { tutorId },
      include: [
        {
          model: Usuario,
          as: 'tutoriado',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json(avances);
  } catch (error) {
    console.error('❌ Error al obtener avances:', error);
    res.status(500).json({
      msg: 'Error al obtener avances',
      error: error.message
    });
  }
};

const obtenerAvancesTutoriado = async (req, res) => {
  try {
    const tutoriadoId = req.usuario.id;
    
    const avances = await Avance.findAll({
      where: { tutoriadoId },
      include: [
        {
          model: Usuario,
          as: 'tutor',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['fecha', 'DESC']]
    });

    res.json(avances);
  } catch (error) {
    console.error('❌ Error al obtener avances:', error);
    res.status(500).json({
      msg: 'Error al obtener avances',
      error: error.message
    });
  }
};

module.exports = {
  registrarAvance,
  obtenerAvancesTutor,
  obtenerAvancesTutoriado
};