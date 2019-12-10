'use strict';
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nombre: { 
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          msg: 'el nombre es requerido.'
        },
        isUnique(value, next) {
          Categoria.findOne({
            where: { nombre: value },
            attributes: ['id']
          }).done((categoria) => {
            if (categoria)
              return next('Ya existe la categoría!');
            next();
          });
        }
      }
    }
  }, {paranoid: true});
  Categoria.associate = function(models) {
    Categoria.hasMany(models.Subcategoria, {
      onDelete: 'CASCADE',
      hooks: true, 
      foreignKey: 'categoriaId',
      as: 'subcategorias'
    });
  };
  return Categoria;
};