import Sequelize, { Model } from 'sequelize';

class Certificado extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // return `http://localhost:3334/certificados/${this.nome}.pdf`;
            return `https://api.tcc.eticasistemas.com.br/certificados/${this.nome}.pdf`;
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
    this.belongsTo(models.EspectadorPalestra, {
      foreignKey: 'id_espectador_palestra',
      as: 'espectador_palestra',
    });
  }
}

export default Certificado;
