const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Relación con tutorías como tutor
      Usuario.belongsToMany(models.Tutoria, {
        through: 'tutores_tutorias',
        as: 'tutoriasComoTutor',
        foreignKey: 'usuario_id',
        otherKey: 'tutoria_id'
      });

      // Relación con tutorías como tutoriado
      Usuario.belongsToMany(models.Tutoria, {
        through: 'tutoriados_tutorias',
        as: 'tutoriasComoTutoriado',
        foreignKey: 'usuario_id',
        otherKey: 'tutoria_id'
      });

      // Relación con tutorías como profesor
      Usuario.hasMany(models.Tutoria, {
        foreignKey: 'profesor_id',
        as: 'tutoriasComoProfesor'
      });

      // Relación con mensajes enviados
      Usuario.hasMany(models.Mensaje, {
        foreignKey: 'emisor_id',
        as: 'mensajesEnviados'
      });

      // Relación con mensajes recibidos
      Usuario.hasMany(models.Mensaje, {
        foreignKey: 'receptor_id',
        as: 'mensajesRecibidos'
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
