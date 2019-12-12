'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
  let localidades = [
    {nombre: "La Plata" },
    {nombre: "Berisso"},
    {nombre: "Ensenada"},
    {nombre: "Avellaneda" },
    {nombre: "Quilmes" },
  ]
   return queryInterface.bulkInsert('localidades', localidades, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('localidades', null, {});
  }
};
