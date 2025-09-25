'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Disable foreign key checks temporarily
      await queryInterface.sequelize.query('SET CONSTRAINTS ALL DEFERRED;');
      
      // Drop tables in correct order
      const dropTablesSQL = `
        DO $$ 
        BEGIN
          -- Drop all related tables first
          DROP TABLE IF EXISTS mensajes CASCADE;
          DROP TABLE IF EXISTS tutoria_tutores CASCADE;
          DROP TABLE IF EXISTS tutoria_tutoriados CASCADE;
          DROP TABLE IF EXISTS tutores_tutorias CASCADE;
          DROP TABLE IF EXISTS tutoriados_tutorias CASCADE;
          
          -- Drop main tables last
          DROP TABLE IF EXISTS tutorias CASCADE;
          DROP TABLE IF EXISTS usuarios CASCADE;
          
          -- Drop ENUM types if they exist
          DROP TYPE IF EXISTS enum_tutorias_estado CASCADE;
          DROP TYPE IF EXISTS enum_usuarios_rol CASCADE;
        END $$;
      `;

      await queryInterface.sequelize.query(dropTablesSQL);
      
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('SET CONSTRAINTS ALL IMMEDIATE;');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Migration Error:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // No down migration needed as this is for cleanup
    return Promise.resolve();
  }
};