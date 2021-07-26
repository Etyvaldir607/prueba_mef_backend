'use strict';

const casual = require('casual');
const { setTimestampsSeeder } = require('../lib/util');

// Datos de producción
let items = [
  {
    nombre: 'Realizar presentación',
    fecha: '2021-07-26',
    hora: '03:40:05',
    descripcion: 'La AGETIC está acá para desarrollar tecnología, que permita modernizar el Estado, transformar la gestión pública y reducir la burocracia. Estas tareas son desarrolladas por bolivianas y bolivianos que trabajan investigando, innovando e implementando nuevas técnicas y tecnologías que permitan el desarrollo soberano de nuestra patria. Para esto, la AGETIC busca a los mejores profesionales, gente joven comprometida con su gente y el destino de su país.',
    estado: 'ACTIVO',
  }
];

// Agregando datos aleatorios para desarrollo
if (typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production') {
  let fakers = Array(9).fill().map((_, i) => {
    let item = {
      nombre: casual.company_name,
      fecha: casual.date('YYYY-MM-DD'),
      hora: casual.time('hh:mm:ss'),
      descripcion: casual.text,
      estado: 'ACTIVO',
    };

    return item;
  });

  items = items.concat(fakers);
}

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_tareas', items, {});
  },

  down (queryInterface, Sequelize) { }
};
