import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import solicitacaoPalestrante from '../app/models/SolicitacaoPalestrante';
import Evento from '../app/models/Evento';
import Palestra from '../app/models/Palestra';
import File from '../app/models/File';
import EspectadorPalestra from '../app/models/EspectadorPalestra';

const models = [
  User,
  solicitacaoPalestrante,
  Evento,
  Palestra,
  File,
  EspectadorPalestra,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(
      databaseConfig.production.database,
      databaseConfig.production.username,
      databaseConfig.production.password,
      {
        host: databaseConfig.production.host,
        dialect: databaseConfig.production.dialect,
        port: databaseConfig.production.port,
      }
    );

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
