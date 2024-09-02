const Pet = require('../models/Pet');

const createPet = async (petData) => {
  const pet = new Pet(petData);
  return await pet.save();
};


const findPetByAttributes = async (name, birthDate, owner, species) => {
  return await Pet.findOne({ name, birthDate, owner, species });
};

const findPetById = async (petId) => {
  return await Pet.findById(petId).populate('owner');
};

const findAllPets = async () => {
  return await Pet.find().populate('owner');
};
const findPetsByOwnerId = async (ownerId) => {
  return await Pet.find({ owner: ownerId });
};

const findPetByOwnerId = async (ownerId) => {
  return await Pet.findOne({ owner: ownerId });
};

const updatePet = async (id, petData) => {
  return await Pet.findByIdAndUpdate(id, petData, { new: true, runValidators: true });
};

const deletePet = async (id) => {
  return await Pet.findByIdAndDelete(id);
};

module.exports = {
  findPetByOwnerId,
  findPetsByOwnerId,
  findPetByAttributes,
  createPet,
  findPetById,
  findAllPets,
  updatePet,
  deletePet,
};
