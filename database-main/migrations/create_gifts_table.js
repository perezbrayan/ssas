/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('gifts', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('product_id').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('users.id');
    table.foreign('product_id').references('roblox_products.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('gifts');
};
