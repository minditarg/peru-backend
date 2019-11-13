

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  let categorias = [
    {nombre: "Albañileria" },
    {nombre: "Electricidad" },
    {nombre: "Gasfiteria" },
    {nombre: "Vidrieria" },
    {nombre: "Carpintería" },
    {nombre: "Soldadura" },
    {nombre: "Cerrajería" },
    {nombre: "Pintura" },
    {nombre: "Jardineria" },
    {nombre: "Drywall" },
    {nombre: "Tapizados" },
    {nombre: "Parquet" },
    {nombre: "Diseño de interiores" },
    {nombre: "Sistemas de seguridad" },
    {nombre: "Aire acondicionado " },
    {nombre: "Instalación de Gas" },
    {nombre: "Mudanzas y Fletes" },
    {nombre: "Ferretería" },
    {nombre: "Ingeniería" },
    {nombre: "Arquitectura" },
  ]
   return queryInterface.bulkInsert('Categoria', categorias, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Categoria', null, {});
  }
};
