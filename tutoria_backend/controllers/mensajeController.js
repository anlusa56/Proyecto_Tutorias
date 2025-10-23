const { Mensaje, Usuario } = require('../models');

// Obtener mensajes de una tutoría
const getMensajesByTutoria = async (req, res) => {
  try {
    const { tutoriaId } = req.params;
    const mensajes = await Mensaje.findAll({
      where: { tutoria_id: tutoriaId },
      include: [
        { model: Usuario, as: 'emisor', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'receptor', attributes: ['id', 'nombre'] }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json(mensajes);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ 
      msg: 'Error al obtener mensajes',
      error: error.message 
    });
  }
};

// Enviar un mensaje
const enviarMensaje = async (req, res) => {
  try {
    const { tutoriaId, receptorId, contenido } = req.body;
    const emisorId = req.usuario.id;

    const mensaje = await Mensaje.create({
      contenido,
      emisor_id: emisorId,
      receptor_id: receptorId,
      tutoria_id: tutoriaId,
      leido: false
    });

    const mensajeCompleto = await Mensaje.findByPk(mensaje.id, {
      include: [
        { model: Usuario, as: 'emisor', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'receptor', attributes: ['id', 'nombre'] }
      ]
    });

    res.status(201).json(mensajeCompleto);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ 
      msg: 'Error al enviar mensaje',
      error: error.message 
    });
  }
};

// Marcar mensajes como leídos
const marcarComoLeido = async (req, res) => {
  try {
    const { mensajeId } = req.params;
    const mensaje = await Mensaje.findByPk(mensajeId);

    if (!mensaje) {
      return res.status(404).json({ msg: 'Mensaje no encontrado' });
    }

    await mensaje.update({ leido: true });
    res.json({ msg: 'Mensaje marcado como leído' });
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    res.status(500).json({ 
      msg: 'Error al marcar mensaje como leído',
      error: error.message 
    });
  }
};

module.exports = {
  getMensajesByTutoria,
  enviarMensaje,
  marcarComoLeido
};