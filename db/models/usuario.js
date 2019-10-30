'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      isUnique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El email es requerido.'
        },
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    provider: DataTypes.ENUM('Local', 'Facebook', 'Google'),
    providerId: DataTypes.STRING,
    avatar: DataTypes.STRING,
    token: DataTypes.STRING
  }, {});
  Usuario.associate = function(models) {
    // associations can be defined here
  };
  return Usuario;
};