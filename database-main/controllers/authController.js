const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = req.db;

    // Verificar si el usuario ya existe
    const existingUser = await db('users')
      .where({ email })
      .first();

    if (existingUser) {
      res.status(400).json({ 
        success: false,
        message: 'El usuario ya existe',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const [userId] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      created_at: new Date()
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Registro exitoso',
      token,
      user: {
        id: userId,
        username,
        email
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el registro',
      timestamp: new Date().toISOString()
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = req.db;

    // Buscar usuario por username en lugar de email
    const user = await db('users')
      .where({ username })
      .first();

    if (!user) {
      res.status(400).json({ 
        success: false,
        message: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).json({ 
        success: false,
        message: 'Contraseña incorrecta',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        email: user.email,
        is_super_admin: user.is_super_admin 
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_super_admin: user.is_super_admin
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  register,
  login
};
