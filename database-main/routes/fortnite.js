const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');

// Obtener todas las órdenes (solo admin)
router.get('/orders', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = req.db;
        const orders = await db('fortnite_orders')
            .select('*')
            .orderBy('created_at', 'desc');

        res.json({
            success: true,
            data: orders,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al obtener órdenes de Fortnite:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener la lista de órdenes',
            timestamp: new Date().toISOString()
        });
    }
});

// Actualizar estado de una orden (solo admin)
router.put('/orders/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, error_message } = req.body;
        const db = req.db;

        // Validar estado
        if (!['pending', 'completed', 'failed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Estado inválido',
                timestamp: new Date().toISOString()
            });
        }

        // Actualizar estado de la orden
        await db('fortnite_orders')
            .where({ id })
            .update({
                status,
                error_message: error_message || null,
                updated_at: new Date()
            });

        res.json({
            success: true,
            message: 'Estado de la orden actualizado exitosamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al actualizar estado de la orden:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar el estado de la orden',
            timestamp: new Date().toISOString()
        });
    }
});

// Crear una nueva orden (usuario autenticado o no)
router.post('/orders', async (req, res) => {
    try {
        const { offer_id, item_name, price, is_bundle, metadata, username } = req.body;
        const db = req.db;

        // Validar campos requeridos
        if (!offer_id || !item_name || !price || !username) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos',
                timestamp: new Date().toISOString()
            });
        }

        console.log('Creando orden con username:', username); // Log para debug

        // Crear nueva orden
        const [orderId] = await db('fortnite_orders').insert({
            user_id: req.user?.id || null,
            username: username, // Asegurarnos de que se guarde el username
            offer_id,
            item_name,
            price,
            is_bundle: is_bundle || false,
            metadata: metadata ? JSON.stringify(metadata) : null,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        });

        // Verificar que la orden se creó correctamente
        const order = await db('fortnite_orders').where({ id: orderId }).first();
        
        console.log('Orden creada:', order); // Log para debug

        res.json({
            success: true,
            data: {
                id: orderId,
                message: 'Orden creada exitosamente',
                order: order // Incluir la orden creada en la respuesta
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al crear orden de Fortnite:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear la orden',
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
