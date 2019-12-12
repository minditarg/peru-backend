'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Proveedors', 'localidadId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Localidades',
        Key: 'id',
        as: 'localidadId'
      }
    }
    );
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
      'Proveedors',
      'localidadId'
    );
  }
};