import Sequelize, { Model } from 'sequelize';

class Evento extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        descricao: Sequelize.STRING,
        local: Sequelize.STRING,
        data_inicio: Sequelize.DATE,
        data_fim: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Palestra, {
      foreignKey: 'id_evento',
      as: 'palestras',
    });
  }
}

export default Evento;
