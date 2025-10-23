'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tutorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      materia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fin: {
        type: Sequelize.TIME,
        allowNull: false
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('programada', 'completada', 'cancelada'),
        defaultValue: 'programada'
      },
      profesor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('tutores_tutorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tutoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tutorias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('tutoriados_tutorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tutoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tutorias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tutoriados_tutorias');
    await queryInterface.dropTable('tutores_tutorias');
    await queryInterface.dropTable('tutorias');
  }
};