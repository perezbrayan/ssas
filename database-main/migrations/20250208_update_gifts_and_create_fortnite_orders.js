exports.up = function(knex) {
    return knex.schema
        // Primero eliminamos las referencias a Roblox en la tabla gifts
        .alterTable('gifts', function(table) {
            // Eliminar la columna product_id y su foreign key
            table.dropForeign(['product_id']);
            table.dropColumn('product_id');
            
            // Agregar columnas específicas para Fortnite
            table.string('offer_id').notNullable();
            table.integer('price').notNullable();
            table.boolean('is_bundle').defaultTo(false);
            table.string('item_name').notNullable();
        })
        // Crear nueva tabla para pedidos de Fortnite
        .createTable('fortnite_orders', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.string('username').notNullable();
            table.string('offer_id').notNullable();
            table.string('item_name').notNullable();
            table.integer('price').notNullable();
            table.boolean('is_bundle').defaultTo(false);
            table.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending');
            table.text('metadata').nullable(); // Para almacenar metadatos adicionales en formato JSON
            table.text('error_message').nullable();
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        // Revertir los cambios en la tabla gifts
        .alterTable('gifts', function(table) {
            table.dropColumn('offer_id');
            table.dropColumn('price');
            table.dropColumn('is_bundle');
            table.dropColumn('item_name');
            
            // Restaurar la columna product_id
            table.integer('product_id').unsigned().references('id').inTable('roblox_products');
        })
        // Eliminar la tabla fortnite_orders
        .dropTable('fortnite_orders');
};
