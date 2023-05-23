import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

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
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            switch (this.ativo) {
              case null:
                return 'Aguardando aprovação';
              case false:
                return 'Cancelado';
              case true:
                if (isBefore(new Date(), this.data_fim)) {
                  return 'Ativo';
                }
                return 'Já aconteceu';
              default:
                return 'Não identificado';
            }
          },
        },
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
    this.hasMany(models.EspectadorPalestra, {
      foreignKey: 'id_palestra',
      as: 'espectador_palestra',
    });
  }
}

export default Palestra;
