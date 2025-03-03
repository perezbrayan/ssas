const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Middleware para logging de rutas admin
router.use((req, res, next) => {
  console.log(`Admin Route: ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Ruta de login para administradores
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.db;

    console.log('Intento de login con email:', email);

    // Buscar el admin en la base de datos
    const admin = await db('admins')
      .where({ email })
      .first();

    if (!admin) {
      console.log('Admin no encontrado');
      res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      console.log('Contraseña inválida');
      res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas',
        timestamp: new Date().toISOString()
      });
      return;
    }

    console.log('Login exitoso para:', admin.email);

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        is_super_admin: true 
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        is_super_admin: true
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en login de admin:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error en el proceso de login',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para crear un nuevo administrador (solo super admin)
router.post('/create', verifyToken, isAdmin, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = req.db;

    // Verificar si el admin ya existe
    const existingAdmin = await db('admins')
      .where({ email })
      .first();

    if (existingAdmin) {
      res.status(400).json({ 
        error: 'El administrador ya existe',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo admin
    const [adminId] = await db('admins').insert({
      username,
      email,
      password: hashedPassword,
      created_at: new Date()
    });

    res.status(201).json({
      message: 'Administrador creado exitosamente',
      admin: {
        id: adminId,
        username,
        email
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear admin:', error);
    res.status(500).json({ 
      error: 'Error al crear el administrador',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para listar todos los administradores (solo super admin)
router.get('/list', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
    const admins = await db('admins')
      .select('id', 'username', 'email', 'created_at')
      .orderBy('created_at', 'desc');

    res.json({
      admins,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al listar admins:', error);
    res.status(500).json({ 
      error: 'Error al obtener la lista de administradores',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para obtener el historial de tasas de V-Bucks
router.get('/vbucks-rate/history', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
    const history = await db('settings')
      .select('vbucks_rate as rate', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(10); // Limitamos a las últimas 10 entradas

    console.log('History retrieved:', history);

    res.json({
      history,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      error: 'Error al obtener el historial de tasas',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para obtener el historial de tasas de VBucks
router.get('/vbucks-rate/history', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
    const history = await db('settings')
      .select('vbucks_rate as rate', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(10); // Limitamos a las últimas 10 entradas

    console.log('History retrieved:', history);

    res.json({
      history,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      error: 'Error al obtener el historial de tasas',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para obtener la tasa actual de V-Bucks
router.get('/vbucks-rate/current', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
    const currentRate = await db('settings')
      .select('vbucks_rate as rate', 'created_at')
      .orderBy('created_at', 'desc')
      .first();

    res.json({
      success: true,
      rate: currentRate?.rate || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener tasa actual:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener la tasa actual',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para actualizar vbucks-rate
router.post('/vbucks-rate', verifyToken, isAdmin, async (req, res) => {
  try {
    const { rate } = req.body;
    const db = req.db;

    console.log('Actualizando rate con:', rate);

    // Insertar nueva entrada en settings
    await db('settings').insert({
      vbucks_rate: rate,
      last_updated: new Date(),
      created_at: new Date()
    });

    res.json({
      message: 'Tasa actualizada exitosamente',
      rate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar tasa:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la tasa',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para listar usuarios
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
    const users = await db('users')
      .select('id', 'username', 'email', 'created_at', 'is_admin')
      .orderBy('created_at', 'desc');

    console.log('Users retrieved:', users);

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener la lista de usuarios',
      timestamp: new Date().toISOString()
    });
  }
});

// Configurar multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/products');
    // Crear el directorio si no existe
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch(err => cb(err));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  }
});

// Ruta para crear un nuevo producto Roblox
router.post('/products', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, amount, type } = req.body;
    const db = req.db;

    if (!req.file) {
      return res.status(400).json({
        error: 'Se requiere una imagen para el producto',
        timestamp: new Date().toISOString()
      });
    }

    // Crear la URL de la imagen relativa al servidor
    const imageUrl = `/db/uploads/products/${req.file.filename}`;

    const [productId] = await db('roblox_products').insert({
      title,
      description,
      price: parseFloat(price),
      amount: parseInt(amount),
      type,
      image_url: imageUrl,
      created_at: new Date(),
      updated_at: new Date()
    });

    const product = await db('roblox_products')
      .where({ id: productId })
      .first();

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      error: 'Error al crear el producto',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta pública para obtener productos (sin autenticación)
router.get('/public/products', async (req, res) => {
  try {
    const db = req.db;
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

// Ruta para obtener todos los productos
router.get('/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = req.db;
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

// Ruta para eliminar un producto
router.delete('/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.db;

    // Primero, obtener la información del producto para poder eliminar la imagen
    const product = await db('roblox_products')
      .where({ id })
      .first();

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        timestamp: new Date().toISOString()
      });
    }

    // Eliminar la imagen si existe
    if (product.image_url) {
      const imagePath = path.join(__dirname, '..', product.image_url);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Error al eliminar la imagen:', err);
        // Continuamos con la eliminación del producto aunque falle la eliminación de la imagen
      }
    }

    // Eliminar el producto de la base de datos
    const deleted = await db('roblox_products')
      .where({ id })
      .del();

    if (deleted) {
      res.json({
        message: 'Producto eliminado exitosamente',
        id,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        error: 'No se pudo eliminar el producto',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      error: 'Error al eliminar el producto',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
