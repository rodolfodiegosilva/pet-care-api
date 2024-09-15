const petRepository = require('../repositories/petRepository');
const userRepository = require('../repositories/userRepository');
const UserDTO = require('../models/userDTO');
const ERROR_MESSAGES = {
  PET_NOT_FOUND: 'Pet não encontrado.',
  OWNER_DATA_NOT_FOUND: 'Dados do proprietário não encontrados.',
  ACCESS_DENIED: 'Acesso negado. Você não é o proprietário deste pet.',
};

const verifyOwnership = async (pet, userId, userRole) => {
  const owner = await userRepository.findUserById(userId);
  if (!owner) {
    throw new Error(ERROR_MESSAGES.OWNER_DATA_NOT_FOUND);
  }
  if (userRole === 'client' && pet.owner.id.toString() !== userId.toString()) {
    throw new Error(ERROR_MESSAGES.ACCESS_DENIED);
  }
};

const createPet = async (petData) => {
  const existingPet = await petRepository.findPetByAttributes(
    petData.name,
    petData.birthDate,
    petData.owner,
    petData.species
  );

  if (existingPet) {
    throw new Error('Pet já cadastrado com esses atributos.');
  }

  let pet = await petRepository.createPet(petData);
  pet = await pet.populate('owner');

  const ownerDTO = new UserDTO(pet.owner);

  return {
    ...pet.toObject(),
    owner: ownerDTO,
  };
};

const getPetById = async (petId, userId, userRole) => {
  let pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error(ERROR_MESSAGES.PET_NOT_FOUND);
  }

  verifyOwnership(pet, userId, userRole);

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
  return await petRepository.findAllPets();
};

const getPetsByOwnerId = async (ownerId) => {
  return await petRepository.findPetsByOwnerId(ownerId);
};

const updatePet = async (petId, petData, userId, userRole) => {
  let pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error(ERROR_MESSAGES.PET_NOT_FOUND);
  }

  verifyOwnership(pet, userId, userRole);

  return await petRepository.updatePet(petId, petData);
};

const deletePet = async (petId, userId, userRole) => {
  let pet = await petRepository.findPetById(petId);

  if (!pet) {
    throw new Error(ERROR_MESSAGES.PET_NOT_FOUND);
  }

  verifyOwnership(pet, userId, userRole);

  await petRepository.deletePet(petId);
};

module.exports = {
  getPetsByOwnerId,
  createPet,
  getPetById,
  getAllPets,
  updatePet,
  deletePet,
  verifyOwnership, // Expondo para uso em outros contextos
};
