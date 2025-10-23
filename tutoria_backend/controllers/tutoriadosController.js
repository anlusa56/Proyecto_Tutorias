const { Usuario, Tutoria, sequelize } = require('../models');

const getTutoriadosByTutor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando tutoriados para el tutor:', id);

    // Obtener todos los tutoriados asignados a las tutorías donde este usuario es tutor
    const tutoriados = await Usuario.findAll({
      attributes: ['id', 'nombre', 'correo'],
      include: [{
        model: Tutoria,
        as: 'tutoriasComoTutoriado',
        required: true,
        attributes: ['id', 'materia', 'fecha', 'estado'],
        include: [{
          model: Usuario,
          as: 'tutores',
          where: { id },
          attributes: []  // No necesitamos los atributos del tutor
        }]
      }]
    });

    console.log('👥 Tutoriados encontrados:', tutoriados.length);

    if (tutoriados.length === 0) {
      return res.status(404).json({
        msg: 'No se encontraron tutoriados asignados a este tutor',
        debug: { tutorId: id }
      });
    }

    res.json(tutoriados);
  } catch (error) {
    console.error('❌ Error al obtener tutoriados:', {
      message: error.message,
      stack: error.stack,
      tutorId: req.params.id
    });
    res.status(500).json({ 
      msg: 'Error al obtener tutoriados',
      error: error.message 
    });
  }
};

module.exports = {
  getTutoriadosByTutor
};
