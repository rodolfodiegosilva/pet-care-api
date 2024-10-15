const express = require('express');
const petController = require('../controllers/petController');
const medicalHistoryController = require('../controllers/medicalHistoryController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validatePet } = require('../validators/petValidator');
const { validateMedicalRecord } = require('../validators/medicalHistoryValidator');

const router = express.Router();

// Rotas para clientes e funcionários com permissões adequadas
router.post('/', authMiddleware, validatePet, petController.createPet);
router.patch('/:id', authMiddleware, validatePet, petController.updatePet);
router.get('/mypets', authMiddleware, authorize(['client']), petController.getMyPets); // Obter pets do cliente
router.get('/:id', authMiddleware, petController.getPetById); // Obter pet por ID
router.delete('/:id', authMiddleware, petController.deletePet); // Deletar pet

// Rotas apenas para funcionários autorizados
router.get('/', authMiddleware, authorize(['veterinarian', 'manager']), petController.getAllPets); // Obter todos os pets
router.get('/owner/:ownerId', authMiddleware, authorize(['veterinarian', 'manager']), petController.getPetsByOwnerId); // Obter pets por ownerId

// Rotas para gerenciamento do histórico médico
router.post('/:id/medical-history', authMiddleware, authorize(['veterinarian']), validateMedicalRecord, medicalHistoryController.addMedicalRecord);
router.get('/:id/medical-history', authMiddleware, medicalHistoryController.getMedicalHistory); // Obter histórico médico

module.exports = router;
