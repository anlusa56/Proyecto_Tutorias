const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ["admin", "profesor", "estudiante_tutor", "estudiante_tutoriado"],
    default: "estudiante_tutoriado"
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);