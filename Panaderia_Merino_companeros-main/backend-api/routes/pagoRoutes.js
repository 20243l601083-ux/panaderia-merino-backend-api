const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const auth = require('../middlewares/authMiddleware');

router.post('/crear-preferencia', pagoController.crearPreferencia);
router.post('/confirmar/:id', auth, pagoController.confirmarPago);
router.post('/webhook', pagoController.webhookMercadoPago);

module.exports = router;
