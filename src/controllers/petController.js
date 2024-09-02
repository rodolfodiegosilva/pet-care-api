const petService = require('../services/petService');
const ERROR_MESSAGES = {
  OWNER_ID_REQUIRED: 'O campo ownerId é obrigatório para funcionários.',
  OWNER_ID_PARAM_REQUIRED: 'O parâmetro ownerId é obrigatório para funcionários.',
};

const createResponse = (status, message, data = null) => {
  return { status, message, data };
};

const createPet = async (req, res) => {
  try {
    const { role: userRole, id: userId } = req.user;
    
    let ownerId;
    if (userRole === 'employee') {
      ownerId = req.body.ownerId;
      if (!ownerId) {
        return res.status(400).json(createResponse('error', ERROR_MESSAGES.OWNER_ID_REQUIRED));
      }
    } else if (userRole === 'client') {
      ownerId = userId;
    }

    const petData = { ...req.body, owner: ownerId };
    const pet = await petService.createPet(petData);

    res.status(201).json(createResponse('success', 'Pet criado com sucesso', pet));
  } catch (error) {
    res.status(400).json(createResponse('error', error.message));
  }
};

const getAllPets = async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json(createResponse('error', ERROR_MESSAGES.ACCESS_DENIED));
    }

    const pets = await petService.getAllPets();
    res.status(200).json(createResponse('success', 'Pets listados com sucesso', pets));
  } catch (error) {
    res.status(500).json(createResponse('error', error.message));
  }
};

const getMyPets = async (req, res) => {
  try {
    let ownerId;

    if (req.user.role === 'employee') {
      ownerId = req.query.ownerId;
      if (!ownerId) {
        return res.status(400).json(createResponse('error', ERROR_MESSAGES.OWNER_ID_PARAM_REQUIRED));
      }
    } else if (req.user.role === 'client') {
      ownerId = req.user.id;
    }

    const pets = await petService.getPetsByOwnerId(ownerId);
    res.status(200).json(createResponse('success', 'Pets listados com sucesso', pets));
  } catch (error) {
    res.status(500).json(createResponse('error', error.message));
  }
};

const getPetById = async (req, res) => {
  try {
    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const pet = await petService.getPetById(petId, userId, userRole);

    res.status(200).json(createResponse('success', 'Pet encontrado', pet));
  } catch (error) {
    res.status(error.message === ERROR_MESSAGES.ACCESS_DENIED ? 403 : 500).json(createResponse('error', error.message));
  }
};

const updatePet = async (req, res) => {
  try {
    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    const updatedPet = await petService.updatePet(petId, req.body, userId, userRole);

    res.status(200).json(createResponse('success', 'Pet atualizado com sucesso', updatedPet));
  } catch (error) {
    res.status(error.message === ERROR_MESSAGES.ACCESS_DENIED ? 403 : 400).json(createResponse('error', error.message));
  }
};

const deletePet = async (req, res) => {
  try {
    const { id: petId } = req.params;
    const { id: userId, role: userRole } = req.user;

    await petService.deletePet(petId, userId, userRole);

    res.status(200).json(createResponse('success', 'Pet deletado com sucesso'));
  } catch (error) {
    res.status(error.message === ERROR_MESSAGES.ACCESS_DENIED ? 403 : 500).json(createResponse('error', error.message));
  }
};

module.exports = {
  createPet,
  getAllPets,
  getMyPets,
  getPetById,
  updatePet,
  deletePet,
};
