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
    descripcion: DataTypes.TEXT,
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La Categoría es requerida.'
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
    Servicio.belongsTo(models.Categoria, { as: 'categoria', constraints: false });
    Servicio.belongsTo(models.Proveedor);
  };
  return Servicio;
};