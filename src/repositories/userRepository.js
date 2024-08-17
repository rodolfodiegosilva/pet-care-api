const UserBase = require('../models/UserBase');
const Client = require('../models/Client');
const Employee = require('../models/Employee');

const findUserByEmail = async (email) => {
  return await UserBase.findOne({ email }); // Procurar em UserBase que inclui todos os subtipos
};

const findUserById = async (id) => {
  return await UserBase.findById(id); // Procurar em UserBase
};

const createUser = async (userData) => {
  let user;
  if (userData.role === 'client') {
    user = new Client(userData);
  } else if (userData.role === 'employee') {
    user = new Employee(userData);
  } else {
    throw new Error('Invalid role specified');
  }
  return await user.save();
};

const findAll = async () => {
  return await UserBase.find(); // Encontrar todos os usuários
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  findAll,
};
