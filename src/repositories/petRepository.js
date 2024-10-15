const Pet = require('../models/Pet');

const createPet = async (petData) => {
  const pet = new Pet(petData);
  return await pet.save();
};

// Adicionar este método ao petRepository.js

const findPetByAttributes = async (name, species, breed, gender, owner) => {
  return await Pet.findOne({ name, species, breed, gender, owner });
};


const findPetById = async (petId) => {
  return await Pet.findById(petId).populate('owner');
};

const findAllPets = async () => {
  return await Pet.find().populate('owner');
};

const findPetsByOwnerId = async (ownerId) => {
  return await Pet.find({ owner: ownerId }).populate('owner');
};

const updatePet = async (id, petData) => {
  return await Pet.findByIdAndUpdate(id, petData, { new: true, runValidators: true });
};

const deletePet = async (id) => {
  return await Pet.findByIdAndDelete(id);
};

module.exports = {
  createPet,
  findPetByAttributes,
  findPetById,
  findAllPets,
  findPetsByOwnerId,
  updatePet,
  deletePet,
};
