'use strict';
module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define('Proveedor', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'el nombre es requerido.'
        },
        // isUnique(value, next) {
        //   Proveedor.findOne({
        //     where: { nombre: value },
        //     attributes: ['id']
        //   }).done((proveedor) => {
        //     if (proveedor)
        //       return next('Ya existe un Proveedor con el mismo nombre');
        //     next();
        //   });
        // }
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
          msg: 'el email es requerido.'
        },
        isEmail: true
      }
    },
    localidadId: {
      type: DataTypes.INTEGER,
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
    
    Proveedor.belongsTo(models.Localidad, {foreignKey: 'localidadId', as: 'localidad'});
  };
  return Proveedor;
};