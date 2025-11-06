const { Reporte, Usuario, Tutoria } = require('../models');
const { Op } = require('sequelize');

exports.getReportes = async (req, res) => {
  try {
    // Si es profesor, filtrar por reportes hechos por tutores
    if (req.usuario?.rol === 'profesor') {
      const reportes = await Reporte.findAll({
        include: [
          { model: Usuario, as: 'autor', where: { rol: 'tutor' } },
          { model: Tutoria, as: 'tutoria' }
        ]
      });
      return res.json(reportes);
    }

    // Si no es profesor, devolver todos
    const reportes = await Reporte.findAll();
    res.json(reportes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener reportes' });
  }
};

exports.getEstadisticas = async (req, res) => {
  try {
    // Obtener todas las tutorías
    const tutorias = await Tutoria.findAll({
      include: [
        { model: Usuario, as: 'profesor' },
        { model: Usuario, as: 'tutores' },
        { model: Usuario, as: 'tutoriados' }
      ]
    });

    // Calcular estadísticas
    const estadisticas = {
      totalTutorias: tutorias.length,
      tutoriasActivas: tutorias.filter(t => t.estado === 'programada' || t.estado === 'activa').length,
      tutoriasCompletadas: tutorias.filter(t => t.estado === 'finalizada').length,
      tutoriasPorMateria: []
    };

    // Agrupar tutorías por materia
    const materias = {};
    tutorias.forEach(tutoria => {
      if (!materias[tutoria.materia]) {
        materias[tutoria.materia] = 0;
      }
      materias[tutoria.materia]++;
    });

    // Convertir el objeto de materias en un array
    estadisticas.tutoriasPorMateria = Object.entries(materias).map(([materia, total]) => ({
      materia,
      total
    }));

    res.json(estadisticas);
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ 
      msg: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
};

// Add this new method for getting tutor reports
exports.getTutorReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [
        { 
          model: Usuario, 
          as: 'autor',
          where: { rol: 'estudiante_tutor' },
          attributes: ['id', 'nombre', 'correo']
        },
        { 
          model: Tutoria,
          as: 'tutoria',
          include: [
            {
              model: Usuario,
              as: 'tutoriasComoTutoriado',
              attributes: ['id', 'nombre']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reportes || []);
  } catch (error) {
    console.error('❌ Error al obtener reportes:', error);
    res.status(500).json({ 
      msg: 'Error al obtener reportes de tutores',
      error: error.message 
    });
  }
};

// Add method to create reports
exports.crearReporte = async (req, res) => {
  try {
    const { tema, descripcion, avance, calificacion, observaciones, tutoria_id } = req.body;
    const autor_id = req.usuario.id;

    const reporte = await Reporte.create({
      tema,
      descripcion,
      avance,
      calificacion,
      observaciones,
      tutoria_id,
      autor_id
    });

    res.status(201).json(reporte);
  } catch (error) {
    console.error('❌ Error al crear reporte:', error);
    res.status(500).json({
      msg: 'Error al crear reporte',
      error: error.message
    });
  }
};
