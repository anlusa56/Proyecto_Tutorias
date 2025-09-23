const jwt = require("jsonwebtoken");
require("dotenv").config();

function verificarToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ msg: "Token requerido" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Token inválido" });
    req.usuario = decoded;
    next();
  });
}

function soloProfesor(req, res, next) {
  if (req.usuario.rol !== "profesor") {
    return res.status(403).json({ msg: "Acceso solo para profesores" });
  }
  next();
}

module.exports = { verificarToken, soloProfesor };

