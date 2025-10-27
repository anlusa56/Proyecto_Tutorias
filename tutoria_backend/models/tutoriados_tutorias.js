'use strict';

module.exports = (sequelize, DataTypes) => {
  const TutoriadosTutorias = sequelize.define('tutoriados_tutorias', {
    tutoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tutorias',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'tutoriados_tutorias',
    timestamps: false,
    underscored: true
  });

  return TutoriadosTutorias;
};
