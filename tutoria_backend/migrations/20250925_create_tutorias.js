'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('Iniciando migración de tutorías...');

      // 1. Crear tabla principal de tutorías
      console.log('Creando tabla tutorias...');
      await queryInterface.createTable('tutorias', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
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
          type: Sequelize.TEXT
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
        estado: {
          type: Sequelize.ENUM('programada', 'en_curso', 'completada', 'cancelada'),
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

      // 2. Crear tabla de relación tutores_tutorias
      console.log('Creando tabla tutores_tutorias...');
      await queryInterface.createTable('tutores_tutorias', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        usuario_id: {
          type: Sequelize.INTEGER,
          references: { model: 'usuarios', key: 'id' },
          onDelete: 'CASCADE'
        },
        tutoria_id: {
          type: Sequelize.INTEGER,
          references: { model: 'tutorias', key: 'id' },
          onDelete: 'CASCADE'
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

      // 3. Crear tabla de relación tutoriados_tutorias
      console.log('Creando tabla tutoriados_tutorias...');
      await queryInterface.createTable('tutoriados_tutorias', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        usuario_id: {
          type: Sequelize.INTEGER,
          references: { model: 'usuarios', key: 'id' },
          onDelete: 'CASCADE'
        },
        tutoria_id: {
          type: Sequelize.INTEGER,
          references: { model: 'tutorias', key: 'id' },
          onDelete: 'CASCADE'
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

      console.log('Migración completada exitosamente');
    } catch (error) {
      console.error('Error durante la migración:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      console.log('Iniciando rollback de migración...');
      await queryInterface.dropTable('tutoriados_tutorias');
      await queryInterface.dropTable('tutores_tutorias');
      await queryInterface.dropTable('tutorias');
      console.log('Rollback completado exitosamente');
    } catch (error) {
      console.error('Error durante el rollback:', error);
      throw error;
    }
  }
};