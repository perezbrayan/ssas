exports.up = function(knex) {
    return knex.schema.createTable('vbucks_rates', function(table) {
        table.increments('id').primary();
        table.decimal('rate', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('vbucks_rates');
};
