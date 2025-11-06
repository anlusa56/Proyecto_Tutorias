const { Avance, Usuario } = require("../models");

exports.crearAvance = async (req, res) => {
  try {
    const { tutoriadoId, fecha, tema, descripcion, calificacion, observaciones } = req.body;

    if (!tutoriadoId || !fecha || !tema || !descripcion || !calificacion) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    const nuevoAvance = await Avance.create({
      tutoriadoId,
      fecha,
      tema,
      descripcion,
      calificacion,
      observaciones
    });

    const avanceCompleto = await Avance.findByPk(nuevoAvance.id, {
      include: [
        {
          model: Usuario,
          as: 'tutoriado',
          attributes: ['id', 'nombre']
        }
      ]
    });

    res.status(201).json(avanceCompleto);
  } catch (error) {
    console.error("Error al crear avance:", error);
    res.status(500).json({ 
      msg: "Error al crear avance",
      error: error.message 
    });
  }
};

exports.obtenerAvances = async (req, res) => {
  try {
    const avances = await Avance.findAll({
      include: [
        {
          model: Usuario,
          as: 'tutoriado',
          attributes: ['id', 'nombre']
        },
        {
          model: Tutoria,
          as: 'tutoria',
          attributes: ['id', 'materia'],
          include: [
            {
              model: Usuario,
              as: 'tutoriasComoTutor',
              attributes: ['id', 'nombre']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(avances);
  } catch (error) {
    console.error("Error al obtener avances:", error);
    res.status(500).json({ error: "Error al obtener avances" });
  }
};

exports.obtenerAvancesPorTutoria = async (req, res) => {
  try {
    const { id } = req.params;
    const avances = await Avance.findAll({ where: { tutoriadoId: id } });
    res.json(avances);
  } catch (error) {
    console.error("Error al obtener avances por tutoría:", error);
    res.status(500).json({ error: "Error al obtener avances por tutoría" });
  }
};

exports.obtenerAvancesPorTutoriado = async (req, res) => {
  try {
    const { id } = req.params;
    const avances = await Avance.findAll({
      where: { tutoriadoId: id },
      order: [["fecha", "DESC"]]
    });
    res.json(avances);
  } catch (error) {
    console.error("Error al obtener avances del tutoriado:", error);
    res.status(500).json({ error: "Error al obtener avances del tutoriado" });
  }
};

