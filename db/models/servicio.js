'use strict';
module.exports = (sequelize, DataTypes) => {
  const Servicio = sequelize.define('Servicio', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre es requerido.'
        }
      }
    },
    foto: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    subcategoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La Subcategoría es requerida.'
        }
      }
    },
    proveedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El Proveedor es requerido.'
        }
      }
    }
  }, {});
  Servicio.associate = function (models) {
    Servicio.belongsTo(models.Subcategoria, { as: 'subcategoria', constraints: false });
    Servicio.belongsTo(models.Proveedor);
    Servicio.hasMany(models.ServicioFoto, {
      onDelete: 'CASCADE',
      hooks: true, 
      foreignKey: 'servicioId',
      as: 'galeria'
    });
  };
  return Servicio;
};