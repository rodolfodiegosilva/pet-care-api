const bcrypt = require('bcryptjs');
const userRepository = require('../src/repositories/userRepository');
const petRepository = require('../src/repositories/petRepository');

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

const populatePets = async (teste) => {
  const createdUsers = await createUsers(teste);

  const pets = [
    {
      name: 'Rocky',
      species: 'Dog',
      breed: 'Bulldog',
      gender: 'Macho',
      birthDate: new Date(2020, 1, 20),
      weight: 20,
      microchipNumber: '1010101010',
      owner: createdUsers.find(user => user.email === `client${teste}@example.com`)._id,
      medicalHistory: [
        {
          date: new Date(2021, 3, 15),
          description: 'Vacinação contra raiva',
          veterinarianId: createdUsers.find(user => user.email === `employee${teste}@example.com`)._id
        }
      ],
      photos: ['https://example.com/photos/rocky1.jpg'],
      feedingInstructions: 'Alimentar três vezes ao dia com ração específica para bulldogs.',
      behaviorNotes: 'Muito enérgico, precisa de atividades diárias.'
    }
  ];

  for (let petData of pets) {
    await petRepository.createPet(petData);
  }
};

module.exports = { populatePets };
