'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Servicios', 'proveedorId', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Proveedors',
        Key: 'id',
        as: 'proveedorId'
      }
    }
    );
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
      'Servicios',
      'proveedorId'
    );
  }
};