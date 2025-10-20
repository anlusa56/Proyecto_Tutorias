import pool from "../database/conexion.js";

// Controlador: Obtener tutoriados por tutor
export const obtenerTutoriadosPorTutor = async (req, res) => {
  const { idTutor } = req.params;

  try {
    // Consulta SQL (ajusta los nombres de tablas y columnas si difieren)
    const result = await pool.query(
      `SELECT t.id, t.nombre, t.correo, t.carrera, t.semestre
       FROM tutoriados t
       INNER JOIN tutorias tu ON t.id = tu.id_tutoriado
       WHERE tu.id_tutor = $1`,
      [idTutor]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron tutoriados para este tutor." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tutoriados:", error);
    res.status(500).json({ mensaje: "Error al obtener tutoriados." });
  }
};
