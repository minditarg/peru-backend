'use strict';
module.exports = (sequelize, DataTypes) => {
  const Proveedor = sequelize.define('Proveedor', {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    tipo:  DataTypes.ENUM('Standar', 'Supervisado', 'Premium'),
    email:  {
        type    : DataTypes.STRING,
        isUnique :true,
        allowNull:false,
        validate:{
            isEmail : true
        }
      },
    foto: DataTypes.STRING,
    telefono: DataTypes.STRING
    }, {
    timestamps: true,
    paranoid: true
  });
  Proveedor.associate = function(models) {
    Proveedor.hasMany(models.Servicio,{
      foreignKey: 'proveedorId',
      as: 'servicios'
    });
    Proveedor.hasOne(models.Categoria, {as: 'categoria', foreignKey: 'categoriaId'});
    Proveedor.hasOne(models.Usuario, {as: 'usuario', foreignKey: 'usuarioId'})
  };
  return Proveedor;
};