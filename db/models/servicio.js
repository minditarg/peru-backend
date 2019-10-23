'use strict';
module.exports = (sequelize, DataTypes) => {
  const Servicio = sequelize.define('Servicio', {
    nombre: DataTypes.STRING,
    categoriaId: DataTypes.INTEGER,
    descripcion: DataTypes.TEXT
  }, {
    timestamps: true,
    paranoid: true
  });
  Servicio.associate = function(models) {
    // associations can be defined here
  };
  return Servicio;
};