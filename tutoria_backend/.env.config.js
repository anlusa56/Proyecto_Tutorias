const dotenv = require('dotenv');

// Configuración global de dotenv
const result = dotenv.config({
  silent: true,
  debug: false,
  override: true
});

if (result.error) {
  console.error('Error cargando variables de entorno:', result.error);
  process.exit(1);
}

module.exports = result.parsed;