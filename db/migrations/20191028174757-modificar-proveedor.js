'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Proveedors', 'usuarioId', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Usuarios',
        Key: 'id',
        as: 'usuarioId'
      }
    }
    );
  },
  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn(
      'Proveedors',
      'usuarioId'
    );
  }
};