const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findAll = async () => {
  return await User.find();
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  findAll,
};
