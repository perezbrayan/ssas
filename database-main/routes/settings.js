const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Ruta para obtener la tasa actual de V-Bucks
router.get('/vbucks-rate', async (req, res) => {
  console.log('📥 GET /api/settings/vbucks-rate - Obteniendo tasa actual');
  try {
    const result = await req.db('settings')
      .select('vbucks_rate')
      .orderBy('last_updated', 'desc')
      .first();

    console.log('📊 Resultado de la consulta:', result);

    if (!result) {
      console.log('❌ No se encontró ninguna tasa');
      res.status(404).json({ error: 'No se encontró ninguna tasa' });
      return;
    }

    // Convertir el string a número
    const rate = parseFloat(result.vbucks_rate);
    const response = { rate };
    console.log('✅ Enviando respuesta:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Error al obtener la tasa de V-Bucks:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
