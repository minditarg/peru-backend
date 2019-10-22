'use strict';
module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define('Proveedor', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    email: DataTypes.STRING,
    foto: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {});
  Proveedor.associate = function(models) {
    // associations can be defined here
  };
  return Proveedor;
};