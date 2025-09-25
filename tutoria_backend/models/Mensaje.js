'use strict';

module.exports = (sequelize, DataTypes) => {
  const Mensaje = sequelize.define('Mensaje', {
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('enviado', 'leido'),
      defaultValue: 'enviado'
    },
    emisorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    receptorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id'
      }
    },
    tutoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tutorias',
        key: 'id'
      }
    }
  }, {
    tableName: 'mensajes',
    timestamps: true,
    underscored: true
  });

  Mensaje.associate = function(models) {
    // Corregimos las asociaciones asegurándonos de que los modelos existan
    if (models.Usuario) {
      Mensaje.belongsTo(models.Usuario, {
        as: 'emisor',
        foreignKey: 'emisorId'
      });
      
      Mensaje.belongsTo(models.Usuario, {
        as: 'receptor',
        foreignKey: 'receptorId'
      });
    }

    if (models.Tutoria) {
      Mensaje.belongsTo(models.Tutoria, {
        foreignKey: 'tutoriaId'
      });
    }
  };

  return Mensaje;
};