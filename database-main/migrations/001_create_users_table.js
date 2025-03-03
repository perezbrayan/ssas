exports.up = function(knex) {
    return knex.schema.hasTable('users').then(function(exists) {
        if (!exists) {
            return knex.schema.createTable('users', function(table) {
                table.increments('id').primary();
                table.string('username').notNullable();
                table.string('email').notNullable().unique();
                table.string('password').notNullable();
                table.boolean('is_super_admin').defaultTo(false);
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
