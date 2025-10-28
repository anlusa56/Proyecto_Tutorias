const { Usuario } = require('../models');

const getSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Usuario.findAll({
      where: { estado_registro: 'pendiente' },
      attributes: ['id', 'nombre', 'correo', 'rol', 'createdAt']
    });
    res.json(solicitudes);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ msg: 'Error al obtener solicitudes' });
  }
};

const aprobarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await usuario.update({
      estado_registro: 'aprobado',
      activo: true
    });

    res.json({ msg: 'Solicitud aprobada exitosamente' });
  } catch (error) {
    console.error('Error al aprobar solicitud:', error);
    res.status(500).json({ msg: 'Error al aprobar solicitud' });
  }
};

const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await usuario.update({ estado_registro: 'rechazado' });
    res.json({ msg: 'Solicitud rechazada exitosamente' });
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    res.status(500).json({ msg: 'Error al rechazar solicitud' });
  }
};

const aprobarTodas = async (req, res) => {
  try {
    await Usuario.update(
      { estado_registro: 'aprobado', activo: true },
      { where: { estado_registro: 'pendiente' } }
    );
    res.json({ msg: 'Todas las solicitudes han sido aprobadas' });
  } catch (error) {
    console.error('Error al aprobar todas las solicitudes:', error);
    res.status(500).json({ msg: 'Error al aprobar solicitudes' });
  }
};

const rechazarTodas = async (req, res) => {
  try {
    await Usuario.update(
      { estado_registro: 'rechazado' },
      { where: { estado_registro: 'pendiente' } }
    );
    res.json({ msg: 'Todas las solicitudes han sido rechazadas' });
  } catch (error) {
    console.error('Error al rechazar todas las solicitudes:', error);
    res.status(500).json({ msg: 'Error al rechazar solicitudes' });
  }
};

module.exports = {
  getSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
  aprobarTodas,
  rechazarTodas
};
