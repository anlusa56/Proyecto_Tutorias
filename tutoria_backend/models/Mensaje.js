'use strict';

module.exports = (sequelize, DataTypes) => {
  const Mensaje = sequelize.define('Mensaje', {
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    emisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    receptor_id: {
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
    },
    leido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'mensajes',
    timestamps: true,
    underscored: true
  });

  Mensaje.associate = (models) => {
    Mensaje.belongsTo(models.Usuario, {
      as: 'emisor',
      foreignKey: 'emisor_id'
    });
    Mensaje.belongsTo(models.Usuario, {
      as: 'receptor',
      foreignKey: 'receptor_id'
    });
    Mensaje.belongsTo(models.Tutoria, {
      as: 'tutoria',
      foreignKey: 'tutoria_id'
    });
  };

  return Mensaje;
};