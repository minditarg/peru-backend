'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    telefono: DataTypes.STRING,
    direccion: DataTypes.STRING
  }, {});
  Cliente.associate = function(models) {
    Cliente.belongsTo(models.Usuario);
  };
  return Cliente;
};