const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Usuario = sequelize.define("Usuario", {
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
    unique: true,
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'profesor', 'estudiante_tutor', 'estudiante_tutoriado'),
    defaultValue: 'estudiante_tutoriado'
  }
}, {
  tableName: "usuarios",
  timestamps: false
});

module.exports = Usuario;
