const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.header("x-token");
  if (!token) return res.status(401).json({ msg: "No hay token, acceso denegado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};

// Middleware para verificar si el usuario es administrador
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") return res.status(403).json({ msg: "Acceso denegado" });
  next();
};

module.exports = { verificarToken, soloAdmin };
