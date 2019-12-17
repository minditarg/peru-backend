'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServicioVideos = sequelize.define('ServicioVideos', {
    video: DataTypes.STRING
  }, {});
  ServicioVideos.associate = function(models) {
    // associations can be defined here
  };
  return ServicioVideos;
};