'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Primero, obtener todos los avances sin tutoria_id
      const avances = await queryInterface.sequelize.query(
        `SELECT id, "tutoriadoId" FROM avances WHERE tutoria_id IS NULL`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Para cada avance, buscar una tutoría asociada al tutoriado
      for (const avance of avances) {
        const tutoria = await queryInterface.sequelize.query(
          `SELECT t.id FROM tutorias t 
           INNER JOIN tutoriados_tutorias tt ON t.id = tt.tutoria_id 
           WHERE tt.usuario_id = :tutoriadoId 
           LIMIT 1`,
          {
            replacements: { tutoriadoId: avance.tutoriadoId },
            type: Sequelize.QueryTypes.SELECT
          }
        );

        if (tutoria[0]) {
          await queryInterface.sequelize.query(
            `UPDATE avances SET tutoria_id = :tutoriaId WHERE id = :avanceId`,
            {
              replacements: { 
                tutoriaId: tutoria[0].id,
                avanceId: avance.id
              }
            }
          );
        }
      }
    } catch (error) {
      console.error('Error en la migración:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No es necesario un down ya que estamos corrigiendo datos
  }
};
