const express = require("express");
const sequelize = require("./sequelize");
const cors = require("cors");
require("dotenv").config();

// Importar modelos
require("./models/Usuario");
require("./models/Tutoria");
require("./models/Mensaje");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/tutorias", require("./routes/tutorias"));
app.use("/api/mensajes", require("./routes/mensajes"));

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log("🟢 Base de datos sincronizada");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();