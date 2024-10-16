const express = require('express');
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize'); // Middleware de autorização

const router = express.Router();

// Rotas públicas
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Rotas protegidas e restritas a certos papéis
router.post('/', authMiddleware, authorize(['admin', 'manager']), serviceController.createService);
router.patch('/:id', authMiddleware, authorize(['admin', 'manager']), serviceController.updateService);
router.delete('/:id', authMiddleware, authorize(['admin', 'manager']), serviceController.deleteService);

module.exports = router;
