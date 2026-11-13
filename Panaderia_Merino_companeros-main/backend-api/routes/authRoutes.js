const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


// Registro de usuarios
router.post('/register', authController.register);

// Login de usuarios
router.post('/login', authController.login);


module.exports = router;