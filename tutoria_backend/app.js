const express = require("express");
const sequelize = require("./sequelize");
const cors = require("cors");
require("dotenv").config();


const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuario.routes"));
app.use("/api/tutorias", require("./routes/tutorias"));

const PORT = process.env.PORT || 4000;

sequelize.sync({ force: false }) // Cambia a true si necesitas reiniciar la base de datos
  .then(() => {
    console.log("🟢 Base de datos sincronizada");
    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error("🔴 Error al sincronizar la base de datos:", err));