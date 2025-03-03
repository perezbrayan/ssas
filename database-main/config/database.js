const knex = require('knex');
const knexfile = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

const db = knex(config);

// Verificar la conexión
db.raw('SELECT 1')
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente');
    console.log('Ambiente:', environment);
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error.message);
  });

module.exports = { db };
