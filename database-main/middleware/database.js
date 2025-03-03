const { db } = require('../config/database');

const databaseMiddleware = async (req, res, next) => {
    try {
        // Verificar la conexión antes de cada request
        await db.raw('SELECT 1');
        req.db = db;
        next();
    } catch (error) {
        console.error('Error en el middleware de base de datos:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState
        });
        res.status(500).json({ 
            error: 'Error de conexión con la base de datos',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
        });
    }
};

module.exports = {
    databaseMiddleware
};
