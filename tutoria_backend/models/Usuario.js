'use strict';

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('admin', 'profesor', 'estudiante_tutor', 'estudiante_tutoriado'),
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
  });

  Usuario.associate = function(models) {
    Usuario.hasMany(models.Tutoria, {
      as: 'tutoriasImpartidas',
      foreignKey: 'profesorId'
    });

    Usuario.belongsToMany(models.Tutoria, {
      through: 'tutores_tutorias',
      as: 'tutoriasComoTutor',
      foreignKey: 'usuarioId'
    });

    Usuario.belongsToMany(models.Tutoria, {
      through: 'tutoriados_tutorias',
      as: 'tutoriasComoTutoriado',
      foreignKey: 'usuarioId'
    });
  };

  return Usuario;
};
