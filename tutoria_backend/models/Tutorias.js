// models/Tutoria.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Usuario = require("./Usuario");

const Tutoria = sequelize.define("Tutoria", {
  materia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

// Relaciones
Usuario.hasMany(Tutoria, { as: "TutoriasComoTutor", foreignKey: "tutorId" });
Usuario.hasMany(Tutoria, { as: "TutoriasComoEstudiante", foreignKey: "estudianteId" });
Tutoria.belongsTo(Usuario, { as: "Tutor", foreignKey: "tutorId" });
Tutoria.belongsTo(Usuario, { as: "Estudiante", foreignKey: "estudianteId" });

module.exports = Tutoria;
