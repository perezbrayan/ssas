const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');

// Obtener todos los regalos (solo admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
    const gifts = await db('gifts')
      .select(
        'gifts.*',
        'users.username',
        'roblox_products.title as product_name'
      )
      .leftJoin('users', 'gifts.user_id', 'users.id')
      .leftJoin('roblox_products', 'gifts.product_id', 'roblox_products.id')
      .orderBy('gifts.created_at', 'desc');

    res.json(gifts);
  } catch (error) {
    console.error('Error al obtener regalos:', error);
    res.status(500).json({
      error: 'Error al obtener la lista de regalos',
      timestamp: new Date().toISOString()
    });
  }
});

// Actualizar estado de un regalo (solo admin)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const db = req.db;

    // Validar estado
    if (!['pending', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        error: 'Estado inválido',
        timestamp: new Date().toISOString()
      });
    }

    // Actualizar estado del regalo
    await db('gifts')
      .where({ id })
      .update({
        status,
        notes,
        updated_at: new Date()
      });

    // Si el regalo se completa, actualizar inventario del usuario
    if (status === 'completed') {
      const gift = await db('gifts')
        .where({ id })
        .first();

      if (gift) {
        // Obtener información del producto
        const product = await db('roblox_products')
          .where({ id: gift.product_id })
          .first();

        if (product) {
          // Actualizar inventario del usuario
          await db('user_inventory').insert({
            user_id: gift.user_id,
            product_id: gift.product_id,
            quantity: 1,
            created_at: new Date()
          });
        }
      }
    }

    res.json({
      message: 'Estado del regalo actualizado exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar estado del regalo:', error);
    res.status(500).json({
      error: 'Error al actualizar el estado del regalo',
      timestamp: new Date().toISOString()
    });
  }
});

// Crear un nuevo regalo (usuario autenticado)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;
    const db = req.db;

    // Verificar si el producto existe
    const product = await db('roblox_products')
      .where({ id: product_id })
      .first();

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        timestamp: new Date().toISOString()
      });
    }

    // Crear nuevo regalo
    const [giftId] = await db('gifts').insert({
      user_id,
      product_id,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      message: 'Regalo creado exitosamente',
      gift_id: giftId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear regalo:', error);
    res.status(500).json({
      error: 'Error al crear el regalo',
      timestamp: new Date().toISOString()
    });
  }
});

// Obtener regalos del usuario actual
router.get('/my-gifts', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const db = req.db;

    const gifts = await db('gifts')
      .select(
        'gifts.*',
        'roblox_products.title as product_name',
        'roblox_products.image_url'
      )
      .leftJoin('roblox_products', 'gifts.product_id', 'roblox_products.id')
      .where('gifts.user_id', user_id)
      .orderBy('gifts.created_at', 'desc');

    res.json(gifts);
  } catch (error) {
    console.error('Error al obtener regalos del usuario:', error);
    res.status(500).json({
      error: 'Error al obtener la lista de regalos',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
