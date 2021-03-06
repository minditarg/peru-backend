'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ServicioFotos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      foto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      servicioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Servicios',
          Key: 'id',
          as: 'servicioId'
        }
      }, 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ServicioFotos');
  }
};