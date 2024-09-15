const db = require('./db');
const petService = require('../src/services/petService');
const { createUsers } = require('./populateUsers');
const { getAuthData } = require('./getData');
const mongoose = require('mongoose');

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('PetService', () => {

  test('create a new pet', async () => {
    await createUsers('createNewPetServiceTest');
    const authData = await getAuthData('createNewPetServiceTest');

    const petData = {
      name: 'Test Pet',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const pet = await petService.createPet(petData);
    expect(pet).toHaveProperty('name', 'Test Pet');
    expect(pet).toHaveProperty('species', 'Dog');
    expect(pet).toHaveProperty('breed', 'Labrador');
    expect(pet).toHaveProperty('gender', 'Macho');
    expect(pet.owner).toHaveProperty('id', authData.clientId);
  });

  test('should throw error if pet with same attributes already exists', async () => {
    await createUsers('duplicatePetTest');
    const authData = await getAuthData('duplicatePetTest');

    const petData = {
      name: 'Test Pet',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    await petService.createPet(petData);

    await expect(petService.createPet(petData)).rejects.toThrow('Pet já cadastrado com esses atributos.');
  });

  test('get pet by id with ownership verification', async () => {
    await createUsers('getPetByIdTestOwner');
    const authData = await getAuthData('getPetByIdTestOwner');

    const petData = {
      name: 'Test Pet 1',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const createdPet = await petService.createPet(petData);

    const pet = await petService.getPetById(createdPet._id, authData.clientId, 'client');
    expect(pet).toHaveProperty('name', 'Test Pet 1');
    expect(pet.owner).toHaveProperty('id', authData.clientId);
  });

  test('should throw error if pet not found by id', async () => {
    await createUsers('petNotFoundTest');
    const authData = await getAuthData('petNotFoundTest');
    const validFakePetId = new mongoose.Types.ObjectId();

    await expect(petService.getPetById(validFakePetId, authData.clientId, 'client')).rejects.toThrow('Pet não encontrado.');
  });

  test('should throw error if owner data not found', async () => {
    await createUsers('ownerDataNotFoundTest');
    const authData = await getAuthData('ownerDataNotFoundTest');

    const petDataWithoutOwner = {
      name: 'Pet without owner',
      birthDate: '2020-01-01',
      owner:  authData.clientId, 
      species: 'Cat',
      breed: 'Siamese',
      gender: 'Fêmea'
    };

    const pet = await petService.createPet(petDataWithoutOwner);

    await expect(petService.getPetById(pet._id, new mongoose.Types.ObjectId(), 'client')).rejects.toThrow('Dados do proprietário não encontrados.');
  });

  test('should throw error if user is not the owner', async () => {
    await createUsers('ownershipVerificationTestOwner');
    const ownerAuthData = await getAuthData('ownershipVerificationTestOwner');

    await createUsers('otherUserTest');
    const otherUserAuthData = await getAuthData('otherUserTest');

    const petData = {
      name: 'Test Pet 1',
      birthDate: '2020-01-01',
      owner: ownerAuthData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const createdPet = await petService.createPet(petData);

    await expect(petService.getPetById(createdPet._id, otherUserAuthData.clientId, 'client')).rejects.toThrow('Acesso negado. Você não é o proprietário deste pet.');
  });

  test('update a pet by id with ownership verification', async () => {
    await createUsers('updatePetTestOwner');
    const authData = await getAuthData('updatePetTestOwner');

    const petData = {
      name: 'Test Pet 1',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const createdPet = await petService.createPet(petData);

    const updatedData = {
      name: 'Updated Pet Name',
    };

    const updatedPet = await petService.updatePet(createdPet._id, updatedData, authData.clientId, 'client');
    expect(updatedPet).toHaveProperty('name', 'Updated Pet Name');
  });

  test('should throw error if trying to update a pet not found', async () => {
    await createUsers('updatePetNotFoundTest');
    const authData = await getAuthData('updatePetNotFoundTest');

    const validFakePetId = new mongoose.Types.ObjectId();

    await expect(petService.updatePet(validFakePetId, {}, authData.clientId, 'client')).rejects.toThrow('Pet não encontrado.');
  });

  test('delete a pet by id with ownership verification', async () => {
    await createUsers('deletePetTestOwner');
    const authData = await getAuthData('deletePetTestOwner');

    const petData = {
      name: 'Test Pet 1',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const createdPet = await petService.createPet(petData);

    await petService.deletePet(createdPet._id, authData.clientId, 'client');

    await expect(petService.getPetById(createdPet._id, authData.clientId, 'client')).rejects.toThrow('Pet não encontrado.');
  });

  test('should throw error if trying to delete a pet not found', async () => {
    await createUsers('deletePetNotFoundTest');
    const authData = await getAuthData('deletePetNotFoundTest');
    const validFakePetId = new mongoose.Types.ObjectId();

    await expect(petService.deletePet(validFakePetId, authData.clientId, 'client')).rejects.toThrow('Pet não encontrado.');
  });

  test('get all pets', async () => {
    await createUsers('getAllPetsTestOwner');
    const authData = await getAuthData('getAllPetsTestOwner');

    const petData1 = {
      name: 'Test Pet 1',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const petData2 = {
      name: 'Test Pet 2',
      birthDate: '2020-06-01',
      owner: authData.clientId,
      species: 'Cat',
      breed: 'Siamese',
      gender: 'Fêmea'
    };

    await petService.createPet(petData1);
    await petService.createPet(petData2);

    const allPets = await petService.getAllPets();
    expect(allPets.length).toBe(2);
  });

  test('get pets by owner id', async () => {
    await createUsers('getPetsByOwnerIdTestOwner');
    const authData = await getAuthData('getPetsByOwnerIdTestOwner');

    const petData1 = {
      name: 'Test Pet 1',
      birthDate: '2020-01-01',
      owner: authData.clientId,
      species: 'Dog',
      breed: 'Labrador',
      gender: 'Macho'
    };

    const petData2 = {
      name: 'Test Pet 2',
      birthDate: '2020-06-01',
      owner: authData.clientId,
      species: 'Cat',
      breed: 'Siamese',
      gender: 'Fêmea'
    };

    await petService.createPet(petData1);
    await petService.createPet(petData2);

    const pets = await petService.getPetsByOwnerId(authData.clientId);
    expect(pets.length).toBe(2);
    expect(pets[0]).toHaveProperty('owner', authData.clientId);
  });

});
