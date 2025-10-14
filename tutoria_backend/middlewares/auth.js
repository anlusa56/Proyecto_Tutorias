const jwt = require("jsonwebtoken");
require("dotenv").config();

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    console.log('Token recibido:', authHeader); // Debug

    if (!authHeader) {
      return res.status(401).json({ msg: "No hay token" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Error de verificación:', err);
        return res.status(401).json({ msg: "Token inválido" });
      }
      console.log('Usuario decodificado:', decoded); // Debug
      req.usuario = decoded;
      next();
    });
  } catch (error) {
    console.error('Error en auth:', error);
    res.status(500).json({ msg: "Error en servidor" });
  }
}

function soloProfesor(req, res, next) {
  if (req.usuario.rol !== "profesor") {
    return res.status(403).json({ msg: "Acceso solo para profesores" });
  }
  next();
}

module.exports = { verificarToken, soloProfesor };

