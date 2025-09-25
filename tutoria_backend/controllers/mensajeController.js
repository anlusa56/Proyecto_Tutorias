const Mensaje = require('../models/Mensaje');
const Usuario = require('../models/Usuario');

const enviarMensaje = async (req, res) => {
  try {
    const { contenido, receptorId, tutoriaId } = req.body;
    const emisorId = req.usuario.id;

    // Validaciones básicas
    if (!contenido || !receptorId || !tutoriaId) {
      return res.status(400).json({
        msg: "Faltan campos requeridos (contenido, receptorId, tutoriaId)"
      });
    }

    const mensaje = await Mensaje.create({
      contenido,
      emisorId,
      receptorId,
      tutoriaId
    });

    const mensajeConDetalles = await Mensaje.findByPk(mensaje.id, {
      include: [
        { model: Usuario, as: 'emisor', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'receptor', attributes: ['id', 'nombre'] }
      ]
    });

    res.status(201).json(mensajeConDetalles);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({
      msg: "Error al enviar mensaje",
      error: error.message
    });
  }
};

const obtenerMensajes = async (req, res) => {
  try {
    const { tutoriaId, otroUsuarioId } = req.query;
    const usuarioId = req.usuario.id;

    const mensajes = await Mensaje.findAll({
      where: {
        tutoriaId,
        [Op.or]: [
          { emisorId: usuarioId, receptorId: otroUsuarioId },
          { emisorId: otroUsuarioId, receptorId: usuarioId }
        ]
      },
      include: [
        { model: Usuario, as: 'emisor', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'receptor', attributes: ['id', 'nombre'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({
      msg: "Error al obtener mensajes",
      error: error.message
    });
  }
};

const marcarComoLeido = async (req, res) => {
  try {
    const { mensajeId } = req.params;
    const usuarioId = req.usuario.id;

    const mensaje = await Mensaje.findByPk(mensajeId);
    
    if (!mensaje) {
      return res.status(404).json({ msg: "Mensaje no encontrado" });
    }

    if (mensaje.receptorId !== usuarioId) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    await mensaje.update({ leido: true });

    res.json({ msg: "Mensaje marcado como leído" });
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    res.status(500).json({
      msg: "Error al actualizar mensaje",
      error: error.message
    });
  }
};

module.exports = {
  enviarMensaje,
  obtenerMensajes,
  marcarComoLeido
};