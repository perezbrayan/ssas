exports.up = function(knex) {
    return knex.schema
        // Primero arreglamos la tabla settings
        .dropTableIfExists('settings')
        .createTable('settings', function(table) {
            table.string('key').primary();
            table.text('value');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        // Insertar el valor inicial de vbucks_rate
        .then(() => {
            return knex('settings').insert({
                key: 'vbucks_rate',
                value: '1.0',
                created_at: new Date(),
                updated_at: new Date()
            });
        })
        // Crear tabla vbucks_rate_history si no existe
        .createTable('vbucks_rate_history', function(table) {
            table.increments('id').primary();
            table.decimal('rate', 10, 2).notNullable();
            table.integer('created_by').unsigned().references('id').inTable('admins');
            table.timestamp('created_at').defaultTo(knex.fn.now());
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
        })
        // Actualizar la tabla gifts para Fortnite
        .alterTable('gifts', function(table) {
            // Eliminar columnas relacionadas con Roblox si existen
            table.dropForeign(['product_id']);
            table.dropColumn('product_id');
            
            // Agregar columnas específicas para Fortnite
            table.string('offer_id').notNullable();
            table.integer('price').notNullable();
            table.boolean('is_bundle').defaultTo(false);
            table.string('item_name').notNullable();
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
            table.integer('product_id').unsigned().references('id').inTable('roblox_products');
        })
        // Eliminar las tablas creadas
        .dropTable('fortnite_orders')
        .dropTable('vbucks_rate_history')
        .dropTable('settings')
        // Recrear la tabla settings original
        .createTable('settings', function(table) {
            table.increments('id').primary();
            table.decimal('vbucks_rate', 10, 2).notNullable();
            table.timestamp('last_updated').defaultTo(knex.fn.now());
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
};
