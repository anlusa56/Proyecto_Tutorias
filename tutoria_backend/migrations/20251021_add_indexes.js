'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('Iniciando creación de índices...');

      // Índices para tutores_tutorias
      await queryInterface.addIndex('tutores_tutorias', ['usuario_id'], {
        name: 'idx_tutores_tutorias_usuario'
      });
      await queryInterface.addIndex('tutores_tutorias', ['tutoria_id'], {
        name: 'idx_tutores_tutorias_tutoria'
      });

      // Índices para tutoriados_tutorias
      await queryInterface.addIndex('tutoriados_tutorias', ['usuario_id'], {
        name: 'idx_tutoriados_tutorias_usuario'
      });
      await queryInterface.addIndex('tutoriados_tutorias', ['tutoria_id'], {
        name: 'idx_tutoriados_tutorias_tutoria'
      });

      // Índice para profesor_id en tutorias
      await queryInterface.addIndex('tutorias', ['profesor_id'], {
        name: 'idx_tutorias_profesor'
      });

      console.log('✅ Índices creados exitosamente');
    } catch (error) {
      console.error('❌ Error al crear índices:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      console.log('Iniciando eliminación de índices...');

      await queryInterface.removeIndex('tutores_tutorias', 'idx_tutores_tutorias_usuario');
      await queryInterface.removeIndex('tutores_tutorias', 'idx_tutores_tutorias_tutoria');
      await queryInterface.removeIndex('tutoriados_tutorias', 'idx_tutoriados_tutorias_usuario');
      await queryInterface.removeIndex('tutoriados_tutorias', 'idx_tutoriados_tutorias_tutoria');
      await queryInterface.removeIndex('tutorias', 'idx_tutorias_profesor');

      console.log('✅ Índices eliminados exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar índices:', error);
      throw error;
    }
  }
};