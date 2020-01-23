'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    telefono: DataTypes.STRING,
    direccion: DataTypes.STRING,
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'el Usuario es requerido'
        }
      }
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {});
  Cliente.associate = function(models) {
    Cliente.belongsTo(models.Usuario);
  };
  return Cliente;
};