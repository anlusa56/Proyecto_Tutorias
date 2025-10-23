'use strict';

module.exports = (sequelize, DataTypes) => {
  const Avance = sequelize.define('Avance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tutoriadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tutoriado_id',
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tutor_id',
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tema: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    calificacion: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 10
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'avances',
    timestamps: true,
    underscored: true
  });

  Avance.associate = (models) => {
    // Relación con el tutoriado
    Avance.belongsTo(models.Usuario, {
      as: 'tutoriado',
      foreignKey: 'tutoriado_id'
    });

    // Relación con el tutor
    Avance.belongsTo(models.Usuario, {
      as: 'tutor',
      foreignKey: 'tutor_id'
    });
  };

  return Avance;
};