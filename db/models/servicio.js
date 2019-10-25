'use strict';
module.exports = (sequelize, DataTypes) => {
  const Servicio = sequelize.define('Servicio', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT
  }, 
  {
    timestamps: true,
    paranoid: true
  });
  Servicio.associate = function(models) {
    Servicio.belongsTo(Categoria); // Will add companyId to user
  };
  return Servicio;
};