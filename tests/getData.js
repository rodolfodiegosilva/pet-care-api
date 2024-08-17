const request = require('supertest');
const app = require('../app');
const UserRepository = require('../src/repositories/userRepository'); 
const PetRepository = require('../src/repositories/petRepository'); 

let clientToken;
let employeeToken;
let clientId;
let employeeId;
let petId;

const getAuthData = async (teste) => {
    const loginClientResponse = await request(app)
    .post('/auth/login')
    .send({ email: `client${teste}@example.com`, password: 'Abc@123' });

  clientToken = loginClientResponse.body.token;
  const client = await UserRepository.findUserByEmail(`client${teste}@example.com`);
  clientId = client._id;

  const loginEmployeeResponse = await request(app)
    .post('/auth/login')
    .send({ email: `employee${teste}@example.com`, password: 'Abc@123' });

  employeeToken = loginEmployeeResponse.body.token;
  const employee = await UserRepository.findUserByEmail(`employee${teste}@example.com`);
  employeeId = employee._id;

  return { clientToken, clientId, employeeToken, employeeId };
};

const getPetData = async (teste) => {
  const pet = await PetRepository.findPetByOwnerId(clientId);
  if (pet) {
    petId = pet._id;
  } else {
    console.error(`Nenhum pet encontrado para o cliente com ID: ${clientId}`);
    petId = null;
  }

  return { petId };
};


module.exports = { getAuthData, getPetData };
