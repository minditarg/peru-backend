'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
  let subcategorias = [
    {nombre: "Pavimento", categoriaId: 1 },
    {nombre: "Lozas", categoriaId: 1 },
    {nombre: "Colocación de aire acondicionado", categoriaId: 2 },
    {nombre: "Tomacorriente" , categoriaId:2},
    {nombre: "Instalación calefones", categoriaId:3 },
  ]
   return queryInterface.bulkInsert('Subcategoria', subcategorias, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Subcategoria', null, {});
  }
};
