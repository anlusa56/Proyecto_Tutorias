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

      // Relación con tutores (muchos a muchos)
      Tutoria.belongsToMany(models.Usuario, {
        through: 'tutores_tutorias',
        as: 'tutoriasComoTutor',
        foreignKey: 'tutoria_id',
        otherKey: 'usuario_id'
      });

      // Relación con tutoriados (muchos a muchos)
      Tutoria.belongsToMany(models.Usuario, {
        through: 'tutoriados_tutorias',
        as: 'tutoriasComoTutoriado',
        foreignKey: 'tutoria_id',
        otherKey: 'usuario_id'
      });

      // Relación con mensajes
      Tutoria.hasMany(models.Mensaje, {
        foreignKey: 'tutoria_id',
        as: 'mensajes'
      });
    }
  }

  Tutoria.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    materia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('programada', 'completada', 'cancelada'),
      defaultValue: 'programada'
    },
    profesor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Tutoria',
    tableName: 'tutorias',
    timestamps: true,
    underscored: true
  });

  return Tutoria;
};
