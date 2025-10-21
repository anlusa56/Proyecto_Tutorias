const { Reporte } = require('../models');
const { Tutoria, Usuario } = require('../models');
const { Op } = require('sequelize');

exports.getReportes = async (req, res) => {
  try {
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
