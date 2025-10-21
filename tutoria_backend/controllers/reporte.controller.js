const { Reporte } = require('../models');
const { Tutoria, Usuario } = require('../models');

exports.getReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll();
    res.json(reportes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener reportes' });
  }
};
