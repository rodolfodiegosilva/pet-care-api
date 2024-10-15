const BlacklistedToken = require('../models/BlacklistedToken');
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    console.log('Iniciando registro de cliente');
    console.log('Dados recebidos no body:', req.body);

    const user = await authService.registerClient(req.body);

    console.log('Cliente registrado com sucesso:', user);

    res.status(201).json(user);
  } catch (error) {
    console.error('Erro durante o registro do cliente:', error);
    res.status(400).json({ message: error.message });
  }
};


const registerEmployee = async (req, res) => {
  try {
    console.log('Iniciando registro de funcionário');
    console.log('Dados recebidos no body:', req.body);

    const { name, email, password, employeeType, department } = req.body;

    // Validação do employeeType
    if (!['supervisor', 'manager', 'cashier', 'veterinarian', 'driver', 'technician'].includes(employeeType)) {
      console.log('Tipo de funcionário inválido:', employeeType);
      return res.status(400).json({ message: 'Tipo de funcionário inválido.' });
    }

    const employeeData = {
      name,
      email,
      password,
      role: 'employee',
      employeeType,
      department,
    };

    console.log('Dados do funcionário a serem enviados para o serviço:', employeeData);

    const employee = await authService.registerEmployee(employeeData);

    console.log('Funcionário registrado com sucesso:', employee);

    res.status(201).json(employee);
  } catch (error) {
    console.error('Erro durante o registro do funcionário:', error);
    res.status(400).json({ message: error.message });
  }
};




const login = async (req, res) => {
  try {
    console.log('Iniciando login');
    console.log('Dados recebidos no body:', req.body);

    const { email, password } = req.body;

    const { token, user } = await authService.login(email, password);

    console.log('Login bem-sucedido para o usuário:', user);

    res.json({ token, user });
  } catch (error) {
    console.error('Erro durante o login:', error);
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

    // Incluir employeeType se o usuário for um funcionário
    if (user.role === 'employee') {
      const Employee = require('../models/Employee');
      const employee = await Employee.findById(user._id);
      if (employee) {
        user.employeeType = employee.employeeType;
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Error retrieving user profile:', error.message);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  register,
  registerEmployee, // Adicionamos a função de registrar funcionário
  login,
  logout,
  getUserProfile,
};
