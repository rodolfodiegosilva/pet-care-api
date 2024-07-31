const BlacklistedToken = require('../models/BlacklistedToken');
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.json({ token, user });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user profile:', error.message);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUserProfile,
};
