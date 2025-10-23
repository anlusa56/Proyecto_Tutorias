const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const validarJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar si el usuario existe en DB
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

module.exports = {
    validarJWT
};