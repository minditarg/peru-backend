'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Usuarios', 'esCliente', {
      type: Sequelize.BOOLEAN
    }
    );
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
      'Usuarios',
      'esCliente'
    );
  }
};