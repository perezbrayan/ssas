const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = req.db;

    // Verificar si el usuario ya existe
    const existingUser = await db('users')
      .where({ email })
      .first();

    if (existingUser) {
      res.status(400).json({ 
        error: 'El usuario ya existe',
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
      error: 'Error en el registro',
      timestamp: new Date().toISOString()
    });
  }
});

// Obtener perfil del usuario
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;

    const user = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'email', 'created_at')
      .first();

    if (!user) {
      res.status(404).json({ 
        error: 'Usuario no encontrado',
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.json({
      user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error al obtener el perfil',
      timestamp: new Date().toISOString()
    });
  }
});

// Actualizar perfil del usuario
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const db = req.db;
    const userId = req.user.id;

    // Verificar si el email ya está en uso por otro usuario
    if (email) {
      const existingUser = await db('users')
        .where('email', email)
        .whereNot('id', userId)
        .first();

      if (existingUser) {
        res.status(400).json({ 
          error: 'El email ya está en uso',
          timestamp: new Date().toISOString()
        });
        return;
      }
    }

    // Actualizar usuario
    await db('users')
      .where({ id: userId })
      .update({
        username: username || undefined,
        email: email || undefined,
        updated_at: new Date()
      });

    res.json({
      message: 'Perfil actualizado exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el perfil',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
