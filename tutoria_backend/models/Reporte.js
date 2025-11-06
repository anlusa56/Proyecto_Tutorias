'use strict';

module.exports = (sequelize, DataTypes) => {
  const Reporte = sequelize.define('Reporte', {
    tema: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    avance: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    calificacion: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 10
      }
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    tutoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tutorias',
        key: 'id'
      }
    }
  }, {
    tableName: 'reportes',
    timestamps: true,
    underscored: true
  });

  Reporte.associate = (models) => {
    Reporte.belongsTo(models.Usuario, {
      as: 'autor',
      foreignKey: 'autor_id'
    });
    Reporte.belongsTo(models.Tutoria, {
      as: 'tutoria',
      foreignKey: 'tutoria_id'
    });
  };

  return Reporte;
};
