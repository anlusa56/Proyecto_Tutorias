// Controlador de configuración del sistema

let configuracion = {
  duracion_tutoria: 60,
  limite_estudiantes: 5,
  horas_anticipacion: 2,
  dias_cancelacion: 1
};

// Obtener la configuración
const obtenerConfiguracion = (req, res) => {
  res.json(configuracion);
};

// Actualizar configuración
const actualizarConfiguracion = (req, res) => {
  configuracion = { ...configuracion, ...req.body };
  res.json({
    message: "Configuración actualizada correctamente",
    configuracion
  });
};

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion
};

