'use strict';
module.exports = (sequelize, DataTypes) => {
  const subcategoria = sequelize.define('Subcategoria', {
    nombre: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          msg: 'el nombre es requerido.'
        }
      }
    }
  }, {});
  subcategoria.associate = function(models) {
    subcategoria.belongsTo(models.Categoria, { as: 'categoria', constraints: false });
  };
  return subcategoria;
};