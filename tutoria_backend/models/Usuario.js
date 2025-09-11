const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Usuario = sequelize.define("Usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM("admin", "profesor", "estudiante_tutor", "estudiante_tutoriado"),
    defaultValue: "estudiante_tutoriado",
  },
});

module.exports = Usuario;