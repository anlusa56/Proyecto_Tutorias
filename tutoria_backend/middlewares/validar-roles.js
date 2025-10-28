const esAdmin = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        msg: "Se requiere verificar el token primero"
      });
    }

    const { rol } = req.usuario;

    if (rol !== 'admin') {
      return res.status(403).json({
        msg: "No tienes permisos de administrador"
      });
    }

    next();
  } catch (error) {
    console.error('Error en middleware esAdmin:', error);
    res.status(500).json({
      msg: "Error al validar rol de administrador"
    });
  }
};

const esProfesor = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        msg: "Se requiere verificar el token primero"
      });
    }

    const { rol } = req.usuario;

    if (rol !== 'profesor') {
      return res.status(403).json({
        msg: "No tienes permisos de profesor"
      });
    }

    next();
  } catch (error) {
    console.error('Error en middleware esProfesor:', error);
    res.status(500).json({
      msg: "Error al validar rol de profesor"
    });
  }
};

module.exports = {
  esAdmin,
  esProfesor
};
