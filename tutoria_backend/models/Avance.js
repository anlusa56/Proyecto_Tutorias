// models/Avance.js
module.exports = (sequelize, DataTypes) => {
  const Avance = sequelize.define("Avance", {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tema: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    calificacion: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    observaciones: {
      type: DataTypes.TEXT
    },
    tutoriadoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "avances",
    timestamps: true,
    underscored: true
  });

  // si hay relación, por ejemplo:
  Avance.associate = (models) => {
    Avance.belongsTo(models.Usuario, {
      as: "tutoriado",
      foreignKey: "tutoriadoId"
    });
  };

  return Avance;
};
