import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class SolicitacaoPalestrante extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        id_foto: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (u) => {
      if (u.password) {
        u.password_hash = await bcrypt.hash(u.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'id_foto',
      as: 'foto',
    });
  }
}

export default SolicitacaoPalestrante;
