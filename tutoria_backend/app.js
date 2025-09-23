const express = require("express");
const sequelize = require("./sequelize");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/tutorias", require("./routes/tutorias"));

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");
    
    await sequelize.sync({ force: false });
    console.log("🟢 Base de datos sincronizada");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

startServer();