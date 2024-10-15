const petService = require('../services/petService');
const { validationResult } = require('express-validator');

const addMedicalRecord = async (req, res) => {
  try {
    // Validação dos dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { id: petId } = req.params;
    const { id: userId } = req.user;
    const medicalRecordData = req.body;

    const updatedPet = await petService.addMedicalRecord(petId, medicalRecordData, userId);

    res.status(200).json({ message: 'Registro médico adicionado com sucesso', data: updatedPet });
  } catch (error) {
    console.error('Erro ao adicionar registro médico:', error);
    res.status(500).json({ message: 'Erro ao adicionar registro médico' });
  }
};

const getMedicalHistory = async (req, res) => {
  try {
    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const medicalHistory = await petService.getMedicalHistory(petId, userId, userRole);

    res.status(200).json({ message: 'Histórico médico obtido com sucesso', data: medicalHistory });
  } catch (error) {
    console.error('Erro ao obter histórico médico:', error);
    if (error.message === 'Acesso negado') {
      res.status(403).json({ message: 'Acesso negado' });
    } else {
      res.status(500).json({ message: 'Erro ao obter histórico médico' });
    }
  }
};

module.exports = {
  addMedicalRecord,
  getMedicalHistory,
};
