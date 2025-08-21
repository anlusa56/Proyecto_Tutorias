const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Usuario = require("./models/Usuario");

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173" // tu frontend Vite
}));
app.use(express.json());

// Rutas (puedes tener otras aparte)
app.use("/api/usuarios", require("./routes/usuarios.routes"));

// Login / registro dinámico
app.post("/api/login", async (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  try {
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      // Crear usuario si no existe
      usuario = new Usuario({ email, password, rol: "tutoriado" });
      await usuario.save();
    } else if (usuario.password !== password) {
      // Si existe pero la contraseña no coincide
      return res.status(401).json({ success: false, message: "credenciales incorrectas" });
    }

    res.json({ success: true, user: { email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// Conexión Mongo + levantar servidor
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 Conectado a MongoDB");
    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error("🔴 Error Mongo:", err));
