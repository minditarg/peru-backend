'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('ServicioFotos', 'deletedAt', 
    {
        type: Sequelize.DATE
    }
    );
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
      'ServicioFotos',
      'deletedAt'
    );
  }
};