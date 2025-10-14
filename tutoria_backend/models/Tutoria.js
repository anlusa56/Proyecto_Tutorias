'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tutoria extends Model {
    static associate(models) {
      // Relación con profesor
      Tutoria.belongsTo(models.Usuario, {
        as: 'profesor',
        foreignKey: 'profesor_id'
      });
      
      // Relación muchos a muchos con tutores
      Tutoria.belongsToMany(models.Usuario, {
        through: {
          model: 'tutores_tutorias',
          unique: false
        },
        as: 'tutores',
        foreignKey: 'tutoria_id',
        otherKey: 'usuario_id'
      });

      // Relación muchos a muchos con tutoriados
      Tutoria.belongsToMany(models.Usuario, {
        through: {
          model: 'tutoriados_tutorias',
          unique: false
        },
        as: 'tutoriados',
        foreignKey: 'tutoria_id',
        otherKey: 'usuario_id'
      });

      // Relación con mensajes
      Tutoria.hasMany(models.Mensaje, {
        as: 'mensajes',
        foreignKey: 'tutoria_id'
      });
    }
  }

  Tutoria.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    materia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('programada', 'en_curso', 'completada', 'cancelada'),
      defaultValue: 'programada'
    }
  }, {
    sequelize,
    modelName: 'Tutoria',
    tableName: 'tutorias',
    underscored: true
  });

  return Tutoria;
};
