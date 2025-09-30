'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Usuario extends Model {}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contraseña: {  // Cambiado de password a contraseña
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'profesor', 'estudiante_tutor', 'estudiante_tutoriado'),
    allowNull: false,
    validate: {
      isIn: [['admin', 'profesor', 'estudiante_tutor', 'estudiante_tutoriado']]
    }
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuarios',
  timestamps: true,
  underscored: true
});

module.exports = Usuario;
