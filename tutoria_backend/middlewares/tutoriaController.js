const Tutoria = require("../models/Tutoria");
const Usuario = require("../models/Usuario");

// Crear tutoría
const crearTutoria = async (req, res) => {
  try {
    const { materia, fecha, tutorId, estudianteId } = req.body;

    // Verificar existencia de usuarios
    const tutor = await Usuario.findByPk(tutorId);
    const estudiante = await Usuario.findByPk(estudianteId);

    if (!tutor || !estudiante) {
      return res.status(404).json({ msg: "Tutor o estudiante no encontrados" });
    }

    // Validar roles
    if (!(tutor.rol === "profesor" || tutor.rol === "estudiante_tutor")) {
      return res.status(400).json({ msg: "El usuario seleccionado no puede ser tutor" });
    }

    if (estudiante.rol !== "estudiante_tutoriado") {
      return res.status(400).json({ msg: "El usuario seleccionado no puede ser tutoriado" });
    }

    // Crear la tutoría
    const nuevaTutoria = await Tutoria.create({ materia, fecha, tutorId, estudianteId });

    res.status(201).json(nuevaTutoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear tutoría" });
  }
};

// Obtener todas las tutorías
const obtenerTutorias = async (req, res) => {
  try {
    const tutorias = await Tutoria.findAll({
      include: [
        { model: Usuario, as: "Tutor", attributes: ["id", "nombre", "correo", "rol"] },
        { model: Usuario, as: "Estudiante", attributes: ["id", "nombre", "correo", "rol"] },
      ],
    });
    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tutorías" });
  }
};

// Obtener una tutoría por ID
const obtenerTutoriaPorId = async (req, res) => {
  try {
    const tutoria = await Tutoria.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: "Tutor", attributes: ["id", "nombre", "correo", "rol"] },
        { model: Usuario, as: "Estudiante", attributes: ["id", "nombre", "correo", "rol"] },
      ],
    });

    if (!tutoria) return res.status(404).json({ msg: "Tutoría no encontrada" });

    res.json(tutoria);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tutoría" });
  }
};

// Eliminar tutoría
const eliminarTutoria = async (req, res) => {
  try {
    const tutoria = await Tutoria.destroy({ where: { id: req.params.id } });
    if (!tutoria) return res.status(404).json({ msg: "Tutoría no encontrada" });
    res.json({ msg: "Tutoría eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar tutoría" });
  }
};

module.exports = {
  crearTutoria,
  obtenerTutorias,
  obtenerTutoriaPorId,
  eliminarTutoria,
};
