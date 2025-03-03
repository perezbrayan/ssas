const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Middleware para logging
router.use((req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.path}`);
  next();
});

router.post('/login', login);
router.post('/register', register);

module.exports = router;
