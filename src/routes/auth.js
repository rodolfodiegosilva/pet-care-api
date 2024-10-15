// src/routes/auth.js

const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize'); // Certifique-se de importar o middleware 'authorize'

const router = express.Router();

router.post('/register', authController.register); // Registro de clientes
router.post(
  '/register-employee',
  authController.registerEmployee
); // Registro de funcionários
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authMiddleware, authController.getUserProfile);

module.exports = router;
