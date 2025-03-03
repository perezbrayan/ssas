const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Token no proporcionado',
                timestamp: new Date().toISOString()
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Token inválido',
            timestamp: new Date().toISOString()
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user?.is_super_admin) {
            return res.status(403).json({ 
                error: 'Acceso denegado: se requieren privilegios de administrador',
                timestamp: new Date().toISOString()
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({ 
            error: 'Error al verificar privilegios de administrador',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
};
