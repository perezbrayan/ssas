exports.up = function(knex) {
    return knex.schema.createTable('roblox_products', function(table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable();
        table.string('image_url');
        table.integer('amount');
        table.string('type').notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('roblox_products');
};
