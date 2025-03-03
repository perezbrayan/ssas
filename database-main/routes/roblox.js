const express = require('express');
const multer = require('multer');
const path = require('path');
const { db } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Configurar multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/roblox'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas para productos de Robux
router.post('/robux', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { amount, price } = req.body;
        const imageUrl = `/uploads/roblox/${req.file?.filename}`;

        const [id] = await db('roblox_products').insert({
            title: `${amount} Robux`,
            description: `Paquete de ${amount} Robux`,
            price: price,
            image_url: imageUrl,
            amount: amount,
            type: 'robux'
        });

        res.status(201).json({
            message: 'Producto de Robux creado exitosamente',
            id: id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al crear producto de Robux:', error);
        res.status(500).json({
            error: 'Error al crear el producto de Robux',
            timestamp: new Date().toISOString()
        });
    }
});

// Rutas para productos de Bloxy Fruits
router.post('/bloxyfruit', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const imageUrl = `/uploads/roblox/${req.file?.filename}`;

        const [id] = await db('roblox_products').insert({
            title,
            description,
            price,
            image_url: imageUrl,
            type: 'bloxyfruit'
        });

        res.status(201).json({
            message: 'Producto de Bloxy Fruits creado exitosamente',
            id: id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al crear producto de Bloxy Fruits:', error);
        res.status(500).json({
            error: 'Error al crear el producto de Bloxy Fruits',
            timestamp: new Date().toISOString()
        });
    }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await db('roblox_products')
            .select('*')
            .orderBy('created_at', 'desc');

        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            error: 'Error al obtener los productos',
            timestamp: new Date().toISOString()
        });
    }
});

// Obtener productos por tipo
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const products = await db('roblox_products')
            .where('type', type)
            .select('*')
            .orderBy('created_at', 'desc');

        res.json(products);
    } catch (error) {
        console.error(`Error al obtener productos de tipo ${req.params.type}:`, error);
        res.status(500).json({
            error: `Error al obtener los productos de tipo ${req.params.type}`,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
