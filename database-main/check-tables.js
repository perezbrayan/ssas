const knex = require('knex')(require('./knexfile').development);

async function checkTables() {
    try {
        const tables = await knex.raw('SHOW TABLES');
        console.log('Tablas existentes:');
        console.log(tables[0].map(t => Object.values(t)[0]));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTables();
