import Sequelize, { Model } from 'sequelize';

class EspectadorPalestra extends Model {
  static init(sequelize) {
    super.init(
      {
        tempo_assistido: Sequelize.INTEGER,
        ultimo_acesso: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'id_espectador',
      as: 'espectador',
    });
    this.belongsTo(models.Palestra, {
      foreignKey: 'id_palestra',
      as: 'palestra',
    });
  }
}

export default EspectadorPalestra;
