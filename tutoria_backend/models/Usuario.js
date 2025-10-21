const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Cambiando los nombres de las asociaciones para que coincidan
      Usuario.belongsToMany(models.Tutoria, {
        through: 'tutores_tutorias',
        as: 'tutores',  // Cambiado de tutoriasComoTutor
        foreignKey: 'usuario_id',
        otherKey: 'tutoria_id'
      });

      Usuario.belongsToMany(models.Tutoria, {
        through: 'tutoriados_tutorias',
        as: 'tutoriados',  // Cambiado de tutoriasComoTutoriado
        foreignKey: 'usuario_id',
        otherKey: 'tutoria_id'
      });

      Usuario.hasMany(models.Tutoria, {
        as: 'profesor',  // Cambiado de tutoriasComoProfesor
        foreignKey: 'profesor_id'
      });
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('admin', 'profesor', 'estudiante_tutor', 'estudiante_tutoriado'),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
  });

  return Usuario;
};
