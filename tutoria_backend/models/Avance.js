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
      allowNull: false,
      validate: {
        min: 0,
        max: 10
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tutoriadoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: "avances",
    timestamps: true,
    underscored: true
  });

  Avance.associate = (models) => {
    Avance.belongsTo(models.Usuario, {
      as: "tutoriado",
      foreignKey: "tutoriadoId"
    });
  };

  return Avance;
};
