const express = require('express');
const cors = require('cors');
const path = require('path');
const { databaseMiddleware } = require('./middleware/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const robloxRoutes = require('./routes/roblox');
const settingsRoutes = require('./routes/settings');
const usersRoutes = require('./routes/users');
const giftRoutes = require('./routes/gifts');
const fortniteRoutes = require('./routes/fortnite');

require('dotenv').config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://blixgg.com',
      'http://localhost:5173',
      'https://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      undefined // Permitir solicitudes sin origen (como Postman)
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origen bloqueado por CORS:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600 // Cache preflight por 10 minutos
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(databaseMiddleware);

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  // Capturar la respuesta
  const oldSend = res.send;
  res.send = function (data) {
    console.log(`[${timestamp}] Response:`, data);
    oldSend.apply(res, arguments);
  };
  
  next();
});

// Configurar middleware para servir archivos estáticos
app.use('/db/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/db/public', express.static(path.join(__dirname, 'public')));

// Rutas con el prefijo /db
app.use('/db/api/auth', authRoutes);
app.use('/db/api/admin', adminRoutes);
app.use('/db/api/roblox', robloxRoutes);
app.use('/db/api/settings', settingsRoutes);
app.use('/db/api/users', usersRoutes);
app.use('/db/api/gifts', giftRoutes);
app.use('/db/api/fortnite', fortniteRoutes);

// Ruta de prueba
app.get('/db', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Puerto para el servidor
const port = process.env.PORT || 10000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`URL base: ${process.env.NODE_ENV === 'development' ? `http://localhost:${port}/db` : 'https://blixgg.com/db'}`);
});
