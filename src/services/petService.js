const petRepository = require('../repositories/petRepository');
const userRepository = require('../repositories/userRepository');
const UserDTO = require('../models/userDTO');

const verifyOwnership = async (pet, userId, userRole) => {
  const ownerId = pet.owner._id ? pet.owner._id.toString() : pet.owner.toString();
  if (userRole === 'client' && ownerId !== userId.toString()) {
    throw new Error('Acesso negado');
  }
};


const createPet = async (petData) => {
  try {
    let pet = await petRepository.createPet(petData);
    pet = await pet.populate('owner');

    const ownerDTO = new UserDTO(pet.owner);

    return {
      ...pet.toObject(),
      owner: ownerDTO,
    };
  } catch (error) {
    if (error.code === 11000) {
      // Erro de duplicidade de chave
      throw new Error('Pet já registrado com esses atributos.');
    }
    throw error;
  }
};


const getPetById = async (petId, userId, userRole) => {
  let pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error('Pet não encontrado');
  }

  await verifyOwnership(pet, userId, userRole);

  if (pet.owner) {
    const ownerDTO = new UserDTO(pet.owner);
    pet = {
      ...pet.toObject(),
      owner: ownerDTO,
    };
  }

  return pet;
};


const getAllPets = async () => {
  const pets = await petRepository.findAllPets();
  return pets.map((pet) => ({
    ...pet.toObject(),
    owner: new UserDTO(pet.owner),
  }));
};

const getPetsByOwnerId = async (ownerId) => {
  const pets = await petRepository.findPetsByOwnerId(ownerId);
  return pets.map((pet) => ({
    ...pet.toObject(),
    owner: new UserDTO(pet.owner),
  }));
};

const updatePet = async (petId, petData, userId, userRole) => {
  let pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error('Pet não encontrado');
  }

  await verifyOwnership(pet, userId, userRole);

  // Clientes não podem atualizar o histórico médico
  if (userRole === 'client') {
    delete petData.medicalHistory;
  }

  const updatedPet = await petRepository.updatePet(petId, petData);

  return updatedPet;
};

const deletePet = async (petId, userId, userRole) => {
  let pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error('Pet não encontrado');
  }

  await verifyOwnership(pet, userId, userRole);

  await petRepository.deletePet(petId);
};

const addMedicalRecord = async (petId, medicalRecordData, userId) => {
  const pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error('Pet não encontrado');
  }

  // Adicionar o ID do veterinário ao registro
  medicalRecordData.veterinarian = userId;

  // Adicionar o registro médico ao histórico
  pet.medicalHistory.push(medicalRecordData);

  // Salvar as alterações
  await pet.save();

  return pet;
};

const getMedicalHistory = async (petId, userId, userRole) => {
  const pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error('Pet não encontrado');
  }

  await verifyOwnership(pet, userId, userRole);

  return pet.medicalHistory;
};

module.exports = {
  createPet,
  getPetById,
  getAllPets,
  getPetsByOwnerId,
  updatePet,
  deletePet,
  addMedicalRecord,
  getMedicalHistory,
};
