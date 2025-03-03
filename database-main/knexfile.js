require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '85.31.233.39',
      user: 'admin',
      password: 'Admin123#',
      database: 'u933411614_gamestore',
      port: 3306
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
