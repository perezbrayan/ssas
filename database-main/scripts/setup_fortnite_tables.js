require('dotenv').config();
const knex = require('knex');
const config = require('../knexfile');

const db = knex(config.development);

async function setupForniteTables() {
    try {
        console.log('Iniciando configuración de tablas para Fortnite...');

        // Verificar y recrear la tabla settings
        console.log('Configurando tabla settings...');
        const hasSettings = await db.schema.hasTable('settings');
        if (hasSettings) {
            await db.schema.dropTable('settings');
        }
        await db.schema.createTable('settings', function(table) {
            table.string('key').primary();
            table.text('value');
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').defaultTo(db.fn.now());
        });

        // Insertar configuración inicial de vbucks_rate
        console.log('Insertando configuración inicial de vbucks_rate...');
        await db('settings').insert({
            key: 'vbucks_rate',
            value: '1.0',
            created_at: new Date(),
            updated_at: new Date()
        });

        // Crear tabla vbucks_rate_history
        console.log('Configurando tabla vbucks_rate_history...');
        const hasVbucksHistory = await db.schema.hasTable('vbucks_rate_history');
        if (hasVbucksHistory) {
            await db.schema.dropTable('vbucks_rate_history');
        }
        await db.schema.createTable('vbucks_rate_history', function(table) {
            table.increments('id').primary();
            table.decimal('rate', 10, 2).notNullable();
            table.integer('created_by').unsigned();
            table.timestamp('created_at').defaultTo(db.fn.now());
        });

        // Crear tabla fortnite_orders
        console.log('Configurando tabla fortnite_orders...');
        const hasFortniteOrders = await db.schema.hasTable('fortnite_orders');
        if (hasFortniteOrders) {
            await db.schema.dropTable('fortnite_orders');
        }
        
        await db.schema.createTable('fortnite_orders', function(table) {
            table.increments('id').primary();
            table.integer('user_id').unsigned();
            table.string('username').notNullable();
            table.string('offer_id').notNullable();
            table.string('item_name').notNullable();
            table.integer('price').notNullable();
            table.boolean('is_bundle').defaultTo(false);
            table.enum('status', ['pending', 'completed', 'failed']).defaultTo('pending');
            table.text('metadata').nullable();
            table.text('error_message').nullable();
            table.timestamps(true, true);
        });

        // Actualizar tabla gifts para Fortnite
        console.log('Actualizando tabla gifts para Fortnite...');
        const hasGifts = await db.schema.hasTable('gifts');
        if (hasGifts) {
            // Verificar si la columna product_id existe antes de intentar eliminarla
            const hasProductId = await db.schema.hasColumn('gifts', 'product_id');
            if (hasProductId) {
                await db.schema.table('gifts', function(table) {
                    table.dropColumn('product_id');
                });
            }

            // Agregar nuevas columnas para Fortnite si no existen
            const columns = ['offer_id', 'price', 'is_bundle', 'item_name'];
            for (const column of columns) {
                const hasColumn = await db.schema.hasColumn('gifts', column);
                if (!hasColumn) {
                    await db.schema.table('gifts', function(table) {
                        switch (column) {
                            case 'offer_id':
                                table.string('offer_id');
                                break;
                            case 'price':
                                table.integer('price');
                                break;
                            case 'is_bundle':
                                table.boolean('is_bundle').defaultTo(false);
                                break;
                            case 'item_name':
                                table.string('item_name');
                                break;
                        }
                    });
                }
            }
        }

        console.log('¡Configuración completada exitosamente!');
        await db.destroy();
        process.exit(0);
    } catch (error) {
        console.error('Error durante la configuración:', error);
        await db.destroy();
        process.exit(1);
    }
}

setupForniteTables();
