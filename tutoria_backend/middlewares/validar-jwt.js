const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' });
  }

  try {
    const payload = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: 'Token no válido' });
  }
};

module.exports = { validarJWT };
