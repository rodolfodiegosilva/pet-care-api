const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

const users = [
  { email: 'user1@example.com', password: 'password1', name: 'User One', role: 'user' },
  { email: 'user2@example.com', password: 'password2', name: 'User Two', role: 'admin' },
];

const populateUsers = async () => {
  for (let userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToSave = { ...userData, password: hashedPassword };
    await userRepository.createUser(userToSave);
  }
};

module.exports = { populateUsers };
