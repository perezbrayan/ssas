const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite'
  },
  useNullAsDefault: true
});

async function runMigration() {
  try {
    // Crear la tabla de gifts
    await knex.schema.createTable('gifts', function(table) {
      table.increments('id').primary();
      table.integer('user_id').notNullable();
      table.integer('product_id').notNullable();
      table.string('status').notNullable().defaultTo('pending');
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    console.log('Tabla de regalos creada exitosamente');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('La tabla de regalos ya existe');
    } else {
      console.error('Error al crear la tabla:', error);
    }
  } finally {
    await knex.destroy();
  }
}

runMigration();
