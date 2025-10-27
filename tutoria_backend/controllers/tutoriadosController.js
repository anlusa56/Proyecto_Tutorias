const { Usuario, Tutoria } = require('../models');

const getTutoriadosByTutor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando tutoriados para el tutor:', id);

    // ✅ Traemos todas las tutorías donde participa este tutor
    const tutorias = await Tutoria.findAll({
      include: [
        {
          model: Usuario,
          as: 'tutoriasComoTutor', // 👈 alias EXACTO del modelo Tutoria.js
          where: { id },
          attributes: ['id', 'nombre', 'correo'],
          through: { attributes: [] },
          required: true
        },
        {
          model: Usuario,
          as: 'tutoriasComoTutoriado', // 👈 alias EXACTO del modelo Tutoria.js
          attributes: ['id', 'nombre', 'correo'],
          through: { attributes: [] },
          required: false
        },
        {
          model: Usuario,
          as: 'profesor', // 👈 alias EXACTO del modelo Tutoria.js
          attributes: ['id', 'nombre', 'correo'],
          required: false
        }
      ],
      attributes: ['id', 'titulo', 'materia', 'fecha', 'hora_inicio', 'hora_fin', 'estado']
    });

    if (!tutorias.length) {
      return res.status(404).json({
        msg: 'No se encontraron tutoriados asignados a este tutor',
        debug: { tutorId: id }
      });
    }

    // ✅ Mapeamos para mostrar los tutoriados de forma simple
    const resultado = tutorias.map(t => ({
      id: t.id,
      titulo: t.titulo,
      materia: t.materia,
      fecha: t.fecha,
      hora_inicio: t.hora_inicio,
      hora_fin: t.hora_fin,
      estado: t.estado,
      profesor: t.profesor ? t.profesor.nombre : 'No asignado',
      tutoriados: t.tutoriasComoTutoriado || []
    }));

    console.log('👥 Tutoriados encontrados:', resultado.length);
    res.json(resultado);
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
