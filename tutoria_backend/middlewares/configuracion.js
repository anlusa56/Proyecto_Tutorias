// middlewares/configuracion.js
const configuracion = {
  duracion_tutoria: 60, // minutos
  limite_estudiantes: 5,
  horas_anticipacion: 2,
  dias_cancelacion: 1
};

const cargarConfiguracion = (req, res, next) => {
  req.configuracion = configuracion;
  next();
};

module.exports = { cargarConfiguracion };
