'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trabajo = sequelize.define('Trabajo', {
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'el Cliente es requerido'
        }
      }
    },
    servicioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'el Servicio es requerido'
        }
      }
    },
    puntajeDelProveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'el puntaje es requerido'
        }
      }
    },
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