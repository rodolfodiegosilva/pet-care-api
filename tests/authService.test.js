const db = require('./db');
const authService = require('../src/services/authService');
const userRepository = require('../src/repositories/userRepository');
const { createUsers } = require('./populateUsers');

beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('AuthService', () => {
  test('register a new client', async () => {
    const userData = {
      email: 'registerNewClient@example.com',
      password: 'Abc@123',
      name: 'Test Client',
      role: 'client',
      clientDetails: { clientType: 'new' }
    };
    const user = await authService.register(userData);
    expect(user).toHaveProperty('email', 'registerNewClient@example.com');
  });

  test('should throw error if email already registered', async () => {
    await createUsers('emailAlreadyRegisteredTest');
    const userData = {
      email: 'clientemailAlreadyRegisteredTest@example.com',
      password: 'Abc@123',
      name: 'Test Client',
      role: 'client',
      clientDetails: { clientType: 'new' }
    };

    await expect(authService.register(userData)).rejects.toThrow('Email already registered');
  });

  test('login with valid credentials', async () => {
    await createUsers('loginValidCredentialsTest');
    const userData = { email: 'clientloginValidCredentialsTest@example.com', password: 'Abc@123' };

    const { token, user: loggedInUser } = await authService.login(userData.email, userData.password);
    expect(token).toBeTruthy();
    expect(loggedInUser).toHaveProperty('email', 'clientloginValidCredentialsTest@example.com');
  });

  test('should throw error with invalid credentials', async () => {
    await createUsers('invalidCredentialsTest');
    const userData = { email: 'clientinvalidCredentialsTest@example.com', password: 'WrongPassword' };

    await expect(authService.login(userData.email, userData.password)).rejects.toThrow('Invalid credentials');
  });

  test('get user by id', async () => {
    const users = await createUsers('getUserByIdTest');
    const userId = users[0]._id;
    const user = await authService.getUserById(userId);
    expect(user).toHaveProperty('email', `clientgetUserByIdTest@example.com`);
  });

  test('should throw error if user not found by id', async () => {
    const fakeUserId = '615f1f1f1f1f1f1f1f1f1f1f'; // ID inexistente no formato MongoDB ObjectId

    await expect(authService.getUserById(fakeUserId)).rejects.toThrow('User not found');
  });

  test('should populate users correctly', async () => {
    const users = await createUsers('populateUsersTest');
    expect(users.length).toBe(2);
    expect(users[0]).toHaveProperty('email', `clientpopulateUsersTest@example.com`);
    expect(users[1]).toHaveProperty('email', `employeepopulateUsersTest@example.com`);
  });
});
