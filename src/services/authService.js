const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const UserDTO = require('../models/userDTO');

const register = async (userData) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  const user = await userRepository.createUser(userData);
  return new UserDTO(user);
};

const login = async (email, password) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return { token, user: new UserDTO(user) };
};

const getUserById = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return new UserDTO(user);
};

module.exports = {
  register,
  login,
  getUserById,
};
