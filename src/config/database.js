const config = require('../../.env');

module.exports = {
  development: {
    username: config.database.user_name,
    password: config.database.password,
    database: config.database.database_name,
    host: config.database.host,
    dialect: config.database.dialect,
    port: config.database.port,
  },
  test: {
    username: config.database.user_name,
    password: config.database.password,
    database: config.database.database_name,
    host: config.database.host,
    dialect: config.database.dialect,
    port: config.database.port,
  },
  production: {
    username: config.database.user_name,
    password: config.database.password,
    database: config.database.database_name,
    host: config.database.host,
    dialect: config.database.dialect,
    port: config.database.port,
  },
};
