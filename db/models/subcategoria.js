'use strict';
module.exports = (sequelize, DataTypes) => {
  const subcategoria = sequelize.define('Subcategoria', {
    nombre: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          msg: 'El nombre es requerido.'
        }
      }
    }
  }, {});
  subcategoria.associate = function(models) {
    // associations can be defined here
  };
  return subcategoria;
};