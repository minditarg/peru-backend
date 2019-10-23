'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Proveedors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Usuarios',
          Key: 'id',
          as: 'usuarioId'
        }
      },
      nombre: {
        type: Sequelize.STRING
      },
      tipo:{
        type: Sequelize.ENUM('Standar', 'Supervisado', 'Premium')  
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING,
      },
      foto: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Proveedors');
  }
};