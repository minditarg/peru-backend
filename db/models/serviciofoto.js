'use strict';
module.exports = (sequelize, DataTypes) => {
  const servicioFoto = sequelize.define('ServicioFoto', {
    foto: DataTypes.TEXT
  }, {});
  servicioFoto.associate = function(models) {
    // associations can be defined here
  };
  return servicioFoto;
};