const request = require('supertest');
const db = require('./db');
const app = require('../app');
const { createUsers } = require('./populateUsers');

beforeAll(async () => await db.connect());
beforeEach(async () =>   await db.clear());
afterAll(async () => await db.close());

describe('AuthController', () => {
  test('registers a new client', async () => {
    const userData = {
      email: 'testclient@example.com',
      password: 'Abc@123',
      name: 'Test Client',
      role: 'client',
      clientDetails: { clientType: 'new' }
    };
    const response = await request(app)
      .post('/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('email', 'testclient@example.com');
  });

  test('login with valid credentials', async () => {

    await createUsers('loginValidCredentialsTest');
    const loginData = { email: 'clientloginValidCredentialsTest@example.com', password: 'Abc@123' };
    const response = await request(app)
      .post('/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user.email', 'clientloginValidCredentialsTest@example.com');
  });

  test('logout user', async () => {
    await createUsers('logoutUserTest');
    const loginData = { email: 'clientlogoutUserTest@example.com', password: 'Abc@123' };
    const loginResponse = await request(app).post('/auth/login').send(loginData);

    const token = loginResponse.body.token;

    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Logout successful');
  });
});
