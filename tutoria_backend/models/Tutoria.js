// models/Tutoria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Usuario = require('./Usuario');

const Tutoria = sequelize.define('Tutoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  materia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('programada', 'en_curso', 'completada', 'cancelada'),
    defaultValue: 'programada'
  },
  profesorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id'
    }
  }
}, {
  tableName: 'tutorias',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relaciones
Tutoria.belongsTo(Usuario, { as: 'profesor', foreignKey: 'profesorId' });
Tutoria.belongsToMany(Usuario, { 
  as: 'tutores',
  through: 'tutoria_tutores',
  foreignKey: 'tutoria_id',
  otherKey: 'tutor_id'
});
Tutoria.belongsToMany(Usuario, {
  as: 'tutoriados',
  through: 'tutoria_tutoriados',
  foreignKey: 'tutoria_id',
  otherKey: 'tutoriado_id'
});

module.exports = Tutoria;
