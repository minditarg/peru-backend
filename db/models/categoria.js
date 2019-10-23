'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nombre: DataTypes.STRING
  }, 
  {
      timestamps: true,
      paranoid: true
  });
  Categoria.associate = function(models) {
    // associations can be defined here
  };
  return Categoria;
};