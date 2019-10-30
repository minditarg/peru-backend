'use strict';
module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define('Proveedor', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre es requerido.'
        },
        isUnique(value, next) {
          Proveedor.findOne({
            where: { nombre: value },
            attributes: ['id']
          }).done((proveedor) => {
            if (proveedor)
              return next('Ya existe un Proveedor con el mismo nombre');
            next();
          });
        }
      },
    },
    descripcion: DataTypes.TEXT,
    direccion: DataTypes.STRING,
    tipo: {
      type: DataTypes.ENUM('Standar', 'Supervisado', 'Premium'),
      defaultValue: 'Standar'
    },
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
    foto: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {});
  Proveedor.associate = function (models) {
    Proveedor.hasMany(models.Servicio, {
      onDelete: 'CASCADE',
      hooks: true, 
      foreignKey: 'proveedorId',
      as: 'servicios'
    });
    Proveedor.belongsTo(models.Usuario, {foreignKey: 'usuarioId',});
  };
  return Proveedor;
};