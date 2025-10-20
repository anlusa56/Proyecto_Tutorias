'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tutoria = sequelize.define('Tutoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
    estado: {
      type: DataTypes.ENUM('programada', 'activa', 'finalizada', 'cancelada'),
      defaultValue: 'programada',
    },
  }, {
    tableName: 'Tutorias',
    timestamps: true,
    underscored: true
  });

  Tutoria.associate = (models) => {
    Tutoria.belongsToMany(models.Usuario, {
      through: 'tutores_tutorias',
      as: 'tutores',
      foreignKey: 'tutoria_id'
    });

    Tutoria.belongsToMany(models.Usuario, {
      through: 'tutoriados_tutorias',
      as: 'tutoriados',
      foreignKey: 'tutoria_id'
    });

    Tutoria.hasMany(models.Mensaje, {
      foreignKey: 'tutoriaId',
      as: 'mensajes'
    });
  };

  return Tutoria;
};
