'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServicioFoto = sequelize.define('ServicioFoto', {
    foto: DataTypes.STRING
  }, {});
  ServicioFoto.associate = function(models) {
    // associations can be defined here
  };
  return ServicioFoto;
};