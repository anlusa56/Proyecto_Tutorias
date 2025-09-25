'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tutoria = sequelize.define('Tutoria', {
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
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    horaFin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    costoPorHora: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    estado: {
      type: DataTypes.ENUM('programada', 'en_curso', 'completada', 'cancelada'),
      defaultValue: 'programada'
    },
    profesorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'tutorias',
    timestamps: true,
    underscored: true
  });

  Tutoria.associate = function(models) {
    Tutoria.belongsTo(models.Usuario, {
      as: 'profesor',
      foreignKey: 'profesorId'
    });
    Tutoria.belongsToMany(models.Usuario, {
      through: 'tutores_tutorias',
      as: 'tutores',
      foreignKey: 'tutoriaId'
    });
    Tutoria.belongsToMany(models.Usuario, {
      through: 'tutoriados_tutorias',
      as: 'tutoriados',
      foreignKey: 'tutoriaId'
    });
  };

  return Tutoria;
};
