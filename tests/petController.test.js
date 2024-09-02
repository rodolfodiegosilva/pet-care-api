const request = require('supertest');
const db = require('./db');
const app = require('../app');
const { getAuthData, getPetData } = require('./getData');
const { populatePets } = require('./populatePets');
const petService = require('../src/services/petService');

jest.setTimeout(30000);

beforeAll(async () => {
  await db.connect();
  await db.clear();
});

afterAll(async () => {
  await db.close();
});

describe('PetController', () => {
  describe('POST /pets/register', () => {
    test('should create a new pet', async () => {

      await populatePets('newPetTest');
      const authData = await getAuthData('newPetTest');

      const petData = {
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        gender: 'Macho',
        birthDate: '2021-01-01',
        ownerId: authData.clientId,
      };
      const response = await request(app)
        .post('/pets/register')
        .set('Authorization', `Bearer ${authData.employeeToken}`)
        .send(petData)
        .expect(201);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('name', 'Buddy');
    });

    test('should return 400 if ownerId is not provided by an employee', async () => {
      const newPet = {
        name: 'Lucky',
        species: 'Dog',
        breed: 'Poodle',
        gender: 'Macho',
        birthDate: '2022-04-10',
      };

      await populatePets('return400Test');
      const authData = await getAuthData('return400Test');

      const response = await request(app)
        .post('/pets/register')
        .set('Authorization', `Bearer ${authData.employeeToken}`)
        .send(newPet)
        .expect(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('O campo ownerId é obrigatório para funcionários.');
    });

    test('should return 400 if required fields are missing', async () => {
      await populatePets('return400RequiredfieldsTest');
      const authData = await getAuthData('return400RequiredfieldsTest');

      const incompletePetData = {
        name: 'IncompletePet'
      };

      const response = await request(app)
        .post('/pets/register')
        .set('Authorization', `Bearer ${authData.employeeToken}`)
        .send(incompletePetData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /pets', () => {
    test('should list all pets for an employee', async () => {
      await populatePets('listAllPetsTest');
      const authData = await getAuthData('listAllPetsTest');

      const response = await request(app)
        .get('/pets')
        .set('Authorization', `Bearer ${authData.employeeToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return 500 if there is a server error', async () => {
      await populatePets('return500Test');
      const authData = await getAuthData('return500Test');

      jest.spyOn(petService, 'getAllPets').mockImplementationOnce(() => {
        throw new Error('Erro simulado para teste');
      });

      const response = await request(app)
        .get('/pets')
        .set('Authorization', `Bearer ${authData.employeeToken}`)
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Erro simulado para teste');
    });
  });

  describe('GET /pets/mypets', () => {
    test('should return pets owned by the client', async () => {
      await populatePets('returnPetsOwnedTest');
      const authData = await getAuthData('returnPetsOwnedTest');

      const response = await request(app)
        .get('/pets/mypets')
        .set('Authorization', `Bearer ${authData.clientToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return 400 if employee does not provide ownerId', async () => {
      await populatePets('return400NotProvideOwnerIdTest');
      const authData = await getAuthData('return400NotProvideOwnerIdTest');

      const response = await request(app)
        .get('/pets/mypets')
        .set('Authorization', `Bearer ${authData.employeeToken}`)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('O parâmetro ownerId é obrigatório para funcionários.');
    });
  });

  describe('GET /pets/:id', () => {
    test('should retrieve a pet by ID for the owner', async () => {
      await populatePets('retrievePetByPetIDTest');
      const authData = await getAuthData('retrievePetByPetIDTest');
      const petData = await getPetData('retrievePetByPetIDTest');

      const response = await request(app)
        .get(`/pets/${petData.petId}`)
        .set('Authorization', `Bearer ${authData.clientToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('name');
    });

  });

  describe('PATCH /pets/:id', () => {
    test('should update pet details', async () => {

      await populatePets('updatePetDetailsTest');
      const authData = await getAuthData('updatePetDetailsTest');
      const petData = await getPetData('updatePetDetailsTest');
      const updatedPet = { name: 'Maximus' };

      const response = await request(app)
        .patch(`/pets/${petData.petId}`)
        .set('Authorization', `Bearer ${authData.clientToken}`)
        .send(updatedPet)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('name', 'Maximus');
    });
  });

  describe('DELETE /pets/:id', () => {
    test('should delete a pet', async () => {
      await populatePets('deletePetTest');
      const authData = await getAuthData('deletePetTest');
      const petData = await getPetData('deletePetTest');

      await request(app)
        .delete(`/pets/${petData.petId}`)
        .set('Authorization', `Bearer ${authData.clientToken}`)
        .expect(200);
    });
  });
});
