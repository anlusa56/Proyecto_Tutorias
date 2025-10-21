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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    estado: {
      type: DataTypes.ENUM('programada', 'en_curso', 'completada', 'cancelada'),
      defaultValue: 'programada',
    },
    profesor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'tutorias',
    timestamps: true,
    underscored: true
  });

  Tutoria.associate = (models) => {
    // Relación con profesor
    Tutoria.belongsTo(models.Usuario, {
      as: 'profesor',
      foreignKey: 'profesor_id'
    });

    // Relación con tutores (muchos a muchos)
    Tutoria.belongsToMany(models.Usuario, {
      through: 'tutores_tutorias',
      as: 'tutores',
      foreignKey: 'tutoria_id',
      otherKey: 'usuario_id'
    });

    // Relación con tutoriados (muchos a muchos)
    Tutoria.belongsToMany(models.Usuario, {
      through: 'tutoriados_tutorias',
      as: 'tutoriados',
      foreignKey: 'tutoria_id',
      otherKey: 'usuario_id'
    });

    // Relación con mensajes
    Tutoria.hasMany(models.Mensaje, {
      foreignKey: 'tutoria_id',
      as: 'mensajes'
    });
  };

  return Tutoria;
};
