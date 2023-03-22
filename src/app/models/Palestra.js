import Sequelize, { Model } from 'sequelize';

class Palestra extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        descricao: Sequelize.STRING,
        local: Sequelize.STRING,
        data_inicio: Sequelize.DATE,
        data_fim: Sequelize.DATE,
        link: Sequelize.STRING,
        tipo: Sequelize.INTEGER,
        ativo: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Evento, {
      foreignKey: 'id_evento',
      as: 'evento',
    });
    this.belongsTo(models.User, {
      foreignKey: 'id_palestrante',
      as: 'palestrante',
    });
  }
}

export default Palestra;
