'use strict';
module.exports = (sequelize, DataTypes) => {
  const PasswordRecovery = sequelize.define('PasswordRecovery', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usado: {
      type: DataTypes.BOOLEAN,
    },
  }, {});
  PasswordRecovery.associate = function (models) {
  };
  return PasswordRecovery;
};