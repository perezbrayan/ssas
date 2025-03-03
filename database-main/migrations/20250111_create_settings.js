exports.up = function(knex) {
    return knex.schema.hasTable('settings').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('settings', function(table) {
                table.increments('id').primary();
                table.decimal('vbucks_rate', 10, 2).notNullable();
                table.timestamp('last_updated').defaultTo(knex.fn.now());
                table.timestamp('created_at').defaultTo(knex.fn.now());
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('settings');
};
