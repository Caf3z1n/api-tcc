module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('SolicitacaoPalestrantes', 'id_foto', {
      type: Sequelize.INTEGER,
      references: { model: 'Files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    }),

  down: (queryInterface) =>
    queryInterface.removeColumn('SolicitacaoPalestrantes', 'id_foto'),
};
