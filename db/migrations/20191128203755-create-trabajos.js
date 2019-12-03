'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trabajos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clienteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clientes',
          Key: 'id',
          as: 'clienteId'
        }
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
      puntajeDelProveedor: {
        type: Sequelize.INTEGER,
      },
      descripcionDelProveedor: {
        type: Sequelize.TEXT
      },
      puntajeDelCliente: {
        type: Sequelize.INTEGER,
      },
      descripcionDelCliente: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Trabajos');
  }
};