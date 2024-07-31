const request = require('supertest');
const db = require('./db');
const app = require('../app');

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('AuthController', () => {
  test('registers a new user', async () => {
    const userData = { email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user' };
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  test('login with valid credentials', async () => {
    const userData = { email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user' };
    await request(app).post('/api/auth/register').send(userData);

    const loginData = { email: 'test@example.com', password: 'password123' };
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user.email', 'test@example.com');
  });

  test('logout user', async () => {
    const userData = { email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user' };
    await request(app).post('/api/auth/register').send(userData);

    const loginData = { email: 'test@example.com', password: 'password123' };
    const loginResponse = await request(app).post('/api/auth/login').send(loginData);

    const token = loginResponse.body.token;

    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Logout successful');
  });
});
