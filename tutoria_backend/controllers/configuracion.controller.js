const fs = require('fs');
const path = require('path');

// Ruta al archivo donde se guardará la configuración
const configPath = path.join(__dirname, '../configuracion.json');

// Configuración por defecto
let configuracion = {
  duracion_tutoria: 60,
  limite_estudiantes: 5,
  horas_anticipacion: 2,
  dias_cancelacion: 1
};

// Cargar configuración desde el archivo (si existe)
if (fs.existsSync(configPath)) {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    configuracion = JSON.parse(data);
    console.log('✅ Configuración cargada desde configuracion.json');
  } catch (error) {
    console.error('❌ Error al leer configuracion.json:', error);
  }
}

// Obtener configuración
const obtenerConfiguracion = (req, res) => {
  res.json(configuracion);
};

// Actualizar configuración (solo admin)
const actualizarConfiguracion = (req, res) => {
  const usuario = req.usuario; // viene del middleware validarJWT

  if (!usuario || usuario.rol !== 'admin') {
    return res.status(403).json({ message: 'No autorizado para cambiar configuración.' });
  }

  configuracion = { ...configuracion, ...req.body };

  // Guardar en archivo JSON
  try {
    fs.writeFileSync(configPath, JSON.stringify(configuracion, null, 2), 'utf8');
    res.json({
      message: 'Configuración actualizada correctamente',
      configuracion
    });
  } catch (error) {
    console.error('❌ Error al guardar configuracion.json:', error);
    res.status(500).json({ message: 'Error al guardar configuración.' });
  }
};

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  configuracion
};
