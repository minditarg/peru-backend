'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trabajo = sequelize.define('Trabajo', {
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El Cliente es requerido.'
        }
      }
    },
    servicioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El Servicio es requerido.'
        }
      }
    },
    puntajeDelProveedor: DataTypes.INTEGER,
    descripcionDelProveedor: DataTypes.TEXT,
    puntajeDelCliente: DataTypes.INTEGER,
    descripcionDelCliente: DataTypes.TEXT
  }, {});
  Trabajo.associate = function(models) {
    Trabajo.belongsTo(models.Cliente);
    Trabajo.belongsTo(models.Servicio);
  };
  return Trabajo;
};