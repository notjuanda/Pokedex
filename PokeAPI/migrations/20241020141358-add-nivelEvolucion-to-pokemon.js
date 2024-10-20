'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregamos la columna 'nivelEvolucion' a la tabla 'Pokemon'
    await queryInterface.addColumn('Pokemon', 'nivelEvolucion', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Puedes modificar el valor por defecto si lo deseas
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertimos los cambios eliminando la columna 'nivelEvolucion'
    await queryInterface.removeColumn('Pokemon', 'nivelEvolucion');
  }
};
