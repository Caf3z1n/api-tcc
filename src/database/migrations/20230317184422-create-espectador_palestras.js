module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('EspectadorPalestras', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_espectador: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      id_palestra: {
        type: Sequelize.INTEGER,
        references: { model: 'Palestras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      tempo_assistido: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ultimo_acesso: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: (queryInterface) => queryInterface.dropTable('EspectadorPalestras'),
};
