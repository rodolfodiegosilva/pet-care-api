const petService = require('../services/petService');
const { validationResult } = require('express-validator');

const createPet = async (req, res) => {
  try {
    // Validação dos dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { role: userRole, id: userId } = req.user;
    let ownerId;

    if (userRole === 'employee') {
      ownerId = req.body.ownerId;
      if (!ownerId) {
        return res.status(400).json({ message: 'O campo ownerId é obrigatório para funcionários.' });
      }
    } else if (userRole === 'client') {
      ownerId = userId;
    }

    const petData = { ...req.body, owner: ownerId };
    const pet = await petService.createPet(petData);

    res.status(201).json({ message: 'Pet criado com sucesso', data: pet });
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    if (error.message === 'Pet já registrado com esses atributos.') {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro ao criar pet' });
    }
  }
};


const getAllPets = async (req, res) => {
  try {
    const pets = await petService.getAllPets();
    res.status(200).json({ message: 'Pets listados com sucesso', data: pets });
  } catch (error) {
    console.error('Erro ao obter pets:', error);
    res.status(500).json({ message: 'Erro ao obter pets' });
  }
};

const getMyPets = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const pets = await petService.getPetsByOwnerId(ownerId);
    res.status(200).json({ message: 'Pets listados com sucesso', data: pets });
  } catch (error) {
    console.error('Erro ao obter seus pets:', error);
    res.status(500).json({ message: 'Erro ao obter seus pets' });
  }
};

const getPetById = async (req, res) => {
  try {
    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const pet = await petService.getPetById(petId, userId, userRole);

    res.status(200).json({ message: 'Pet encontrado', data: pet });
  } catch (error) {
    console.error('Erro ao obter pet:', error);
    if (error.message === 'Acesso negado') {
      res.status(403).json({ message: 'Acesso negado' });
    } else {
      res.status(404).json({ message: 'Pet não encontrado' });
    }
  }
};

const updatePet = async (req, res) => {
  try {
    // Validação dos dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const updatedPet = await petService.updatePet(petId, req.body, userId, userRole);

    res.status(200).json({ message: 'Pet atualizado com sucesso', data: updatedPet });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    if (error.message === 'Acesso negado') {
      res.status(403).json({ message: 'Acesso negado' });
    } else if (error.message === 'Pet não encontrado') {
      res.status(404).json({ message: 'Pet não encontrado' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar pet' });
    }
  }
};

const deletePet = async (req, res) => {
  try {
    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    await petService.deletePet(petId, userId, userRole);

    res.status(200).json({ message: 'Pet deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    if (error.message === 'Acesso negado') {
      res.status(403).json({ message: 'Acesso negado' });
    } else if (error.message === 'Pet não encontrado') {
      res.status(404).json({ message: 'Pet não encontrado' });
    } else {
      res.status(500).json({ message: 'Erro ao deletar pet' });
    }
  }
};

const getPetsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const pets = await petService.getPetsByOwnerId(ownerId);
    res.status(200).json({ message: 'Pets listados com sucesso', data: pets });
  } catch (error) {
    console.error('Erro ao obter pets do proprietário:', error);
    res.status(500).json({ message: 'Erro ao obter pets do proprietário' });
  }
};

module.exports = {
  createPet,
  getAllPets,
  getMyPets,
  getPetById,
  updatePet,
  deletePet,
  getPetsByOwnerId,
};
