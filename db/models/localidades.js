'use strict';
module.exports = (sequelize, DataTypes) => {
  const Localidad = sequelize.define('Localidad', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'el nombre es requerido'
        },
      },
    },
  }, {tableName: "Localidades"});
  Localidad.associate = function(models) {
    // associations can be defined here
  };
  return Localidad;
};