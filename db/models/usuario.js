'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    password: DataTypes.STRING,
    provider: DataTypes.ENUM('Local', 'Facebook', 'Google'),
    providerId: DataTypes.STRING,
    token: DataTypes.STRING,
    email:  {
      type    : DataTypes.STRING,
      isUnique :true,
      allowNull:false,
      validate:{
          isEmail : true
      }
    },
    foto: DataTypes.STRING
  }, {
    timestamps: true,
    paranoid: true
  });
  Usuario.associate = function(models) {
    User.hasMany(models.Comment,{
      foreignKey: 'userId',
      as: 'comments'
    });
  };
  return Usuario;
};