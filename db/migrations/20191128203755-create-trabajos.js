'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Trabajo', {
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
          model: 'Cliente',
          Key: 'id',
          as: 'clienteId'
        }
      },
      servicioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Servicio',
          Key: 'id',
          as: 'servicioId'
        }
      },
      puntajeDelProveedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      descripcionDelProveedor: {
        type: Sequelize.TEXT
      },
      puntajeDelCliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    return queryInterface.dropTable('Trabajo');
  }
};