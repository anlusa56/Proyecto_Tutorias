const jwt = require("jsonwebtoken");
require("dotenv").config();

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    console.log('📝 Headers recibidos:', req.headers);
    console.log('🔑 Token recibido:', authHeader);
    console.log('🛣️ Ruta accedida:', req.method, req.originalUrl);

    if (!authHeader) {
      console.log('❌ No se recibió token en el header');
      return res.status(401).json({ msg: "No hay token" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('❌ Error de verificación del token:', {
          name: err.name,
          message: err.message
        });
        return res.status(401).json({ msg: "Token inválido" });
      }
      console.log('✅ Usuario verificado:', {
        id: decoded.id,
        rol: decoded.rol
      });
      req.usuario = decoded;
      next();
    });
  } catch (error) {
    console.error('❌ Error en middleware de autenticación:', {
      message: error.message,
      stack: error.stack
    });
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

