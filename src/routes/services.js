const express = require('express');
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, serviceController.createService);
router.get('/', authMiddleware, serviceController.getAllServices);
router.get('/:id', authMiddleware, serviceController.getServiceById);
router.patch('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;
