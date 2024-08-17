const bcrypt = require('bcryptjs');
const userRepository = require('../src/repositories/userRepository');

const createUsers = async (teste) => {
  const users = [
    {
      email: `client${teste}@example.com`,
      password: 'Abc@123',
      name: `Client ${teste}`,
      role: 'client',
      clientDetails: { clientType: 'new' },
    },
    {
      email: `employee${teste}@example.com`,
      password: 'Abc@123',
      name: `Employee ${teste}`,
      role: 'employee',
      employeeDetails: { employeeType: 'veterinarian', department: 'veterinary' },
    }
  ];

  const createdUsers = [];

  for (let userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    let savedUser = await userRepository.createUser(userData);
    createdUsers.push(savedUser);
  }

  return createdUsers;
};

module.exports = { createUsers };
