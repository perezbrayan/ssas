exports.up = function(knex) {
  return knex.schema
    .createTableIfNotExists('vbucks_rate_history', function(table) {
      table.increments('id').primary();
      table.decimal('rate', 10, 2).notNullable();
      table.integer('created_by').unsigned().references('id').inTable('admins');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .then(() => {
      return knex.schema.hasTable('settings').then(exists => {
        if (!exists) {
          return knex.schema.createTable('settings', function(table) {
            table.string('key').primary();
            table.text('value');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
          });
        }
      });
    })
    .then(() => {
      // Insertar valor inicial de vbucks_rate si no existe
      return knex('settings')
        .where({ key: 'vbucks_rate' })
        .first()
        .then(setting => {
          if (!setting) {
            return knex('settings').insert({
              key: 'vbucks_rate',
              value: '1.0',
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        });
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('vbucks_rate_history')
    .then(() => {
      return knex('settings')
        .where({ key: 'vbucks_rate' })
        .delete();
    });
};
