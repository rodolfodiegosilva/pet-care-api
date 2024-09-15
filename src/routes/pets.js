const express = require('express');
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', authMiddleware, petController.createPet);
router.get('/', authMiddleware, petController.getAllPets);
router.get('/mypets', authMiddleware, petController.getMyPets);
router.get('/:id', authMiddleware, petController.getPetById);

router.patch('/:id', authMiddleware, petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
