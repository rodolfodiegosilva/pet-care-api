const db = require('./db');
const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');
const { populateUsers } = require('./populateUsers');

beforeAll(async () => await db.connect());
beforeEach(async () => {
  await db.clear();
  await populateUsers();
});
afterAll(async () => await db.close());

describe('AuthService', () => {
  test('registers a new user', async () => {
    const userData = { email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user' };
    const user = await authService.register(userData);
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  test('login with valid credentials', async () => {
    const userData = { email: 'user1@example.com', password: 'password1' };
    const user = await userRepository.findUserByEmail(userData.email);

    const { token, user: loggedInUser } = await authService.login(userData.email, userData.password);
    expect(token).toBeTruthy();
    expect(loggedInUser).toHaveProperty('email', 'user1@example.com');
  });

  test('get user by id', async () => {
    const users = await userRepository.findAll();
    const userId = users[0]._id;
    const user = await authService.getUserById(userId);
    expect(user).toHaveProperty('email', 'user1@example.com');
  });

  test('should populate users correctly', async () => {
    const users = await userRepository.findAll();
    expect(users.length).toBe(2);
    expect(users[0]).toHaveProperty('email', 'user1@example.com');
    expect(users[1]).toHaveProperty('email', 'user2@example.com');
  });
});
