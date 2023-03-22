module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Users', 'id_foto', {
      type: Sequelize.INTEGER,
      references: { model: 'Files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    }),

  down: (queryInterface) => queryInterface.removeColumn('Users', 'id_foto'),
};
