const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Usuario = require('./Usuario');
const Tutoria = require('./Tutoria');

const Mensaje = sequelize.define('Mensaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  emisorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  receptorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  tutoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tutoria,
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

// Relaciones
Mensaje.belongsTo(Usuario, { as: 'emisor', foreignKey: 'emisorId' });
Mensaje.belongsTo(Usuario, { as: 'receptor', foreignKey: 'receptorId' });
Mensaje.belongsTo(Tutoria, { as: 'tutoria', foreignKey: 'tutoriaId' });

module.exports = Mensaje;