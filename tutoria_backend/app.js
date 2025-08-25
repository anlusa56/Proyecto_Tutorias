const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Usuario = require("./models/Usuario");

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173" // tu frontend Vite
}));
app.use(express.json());

// Rutas (puedes tener otras aparte)
app.use("/api/usuarios", require("./routes/usuario.routes"));

// Login / registro dinámico
app.post("/api/login", async (req, res) => {
  let { email, contraseña } = req.body;

  email = email.trim();
  contraseña = contraseña.trim();

  try {
    let usuario = await Usuario.findOne({ correo: email });

    if (!usuario) {
      // Crear usuario si no existe y hashear la contraseña
      const hash = await bcrypt.hash(contraseña, 10);
      usuario = new Usuario({ correo: email, contraseña: hash, rol: "tutoriado" });
      await usuario.save();
    } else {
      // Comparar la contraseña enviada con el hash guardado
      const match = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!match) {
        return res.status(401).json({ success: false, message: "credenciales incorrectas" });
      }
    }

    res.json({ success: true, user: { correo: usuario.correo, rol: usuario.rol } });
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
