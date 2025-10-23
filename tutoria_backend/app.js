const express = require("express");
const cors = require("cors");
require("dotenv").config({
  path: ['.env.local', '.env']
});

// Importar modelos y conexión a DB
const { sequelize, Usuario, Tutoria, Mensaje } = require('./models');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/tutorias", require("./routes/tutorias"));
app.use("/api/mensajes", require("./routes/mensajes"));
app.use("/api/configuracion", require("./routes/configuracion.routes"));
app.use('/api/reportes', require('./routes/reporte.routes'));
app.use('/api/tutoriados', require('./routes/tutoriadosRoutes'));
app.use('/api/avances', require('./routes/avances'));

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");
    
    // Sincronizar todos los modelos
    await sequelize.sync({ alter: true });
    console.log("✅ Modelos sincronizados");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

    // Manejar cierre gracioso
    process.on('SIGTERM', async () => {
      try {
        console.log('🔄 Cerrando servidor...');
        await sequelize.close();
        process.exit(0);
      } catch (err) {
        console.error('❌ Error al cerrar:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.original) {
      console.error("Detalles:", error.original.message);
    }
    process.exit(1);
  }
};

startServer().catch(console.error);