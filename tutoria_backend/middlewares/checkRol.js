/**
 * Middleware para verificar roles
 * @param {Array} roles Array de roles permitidos
 */
const checkRol = (roles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario existe en el request (puesto por auth middleware)
      if (!req.usuario) {
        return res.status(401).json({
          msg: "Token no válido - Usuario no encontrado"
        });
      }

      // Verificar si el rol del usuario está en el array de roles permitidos
      if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({
          msg: `El servicio requiere uno de estos roles: ${roles.join(', ')}`
        });
      }

      // Si todo está bien, continuar
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        msg: "Error al verificar rol"
      });
    }
  };
};

module.exports = checkRol;