'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('avances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tutoriado_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tutor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tema: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      calificacion: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Crear índices para mejorar el rendimiento de las consultas
    await queryInterface.addIndex('avances', ['tutor_id']);
    await queryInterface.addIndex('avances', ['tutoriado_id']);
    await queryInterface.addIndex('avances', ['fecha']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('avances');
  }
};