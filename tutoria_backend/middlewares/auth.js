const jwt = require("jsonwebtoken");
require("dotenv").config();

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ msg: "No hay token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Formato de token inválido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Error de verificación:', err);
        return res.status(401).json({ msg: "Token inválido o expirado" });
      }
      req.usuario = decoded;
      next();
    });
  } catch (error) {
    console.error('Error en verificación de token:', error);
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

