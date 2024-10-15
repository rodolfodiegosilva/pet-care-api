const UserBase = require('../models/UserBase');
const Employee = require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerClient = async (userData) => {
  try {
    console.log('Iniciando registro no authService.registerClient');
    console.log('Dados do usuário:', userData);

    // Verifique se o email já está em uso
    const existingUser = await UserBase.findOne({ email: userData.email });
    if (existingUser) {
      console.log('Email já está em uso:', userData.email);
      throw new Error('Email já está em uso.');
    }

    // Criptografar a senha
    console.log('Criptografando a senha');
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // Definir o papel como 'client'
    userData.role = 'client';

    console.log('Criando novo UserBase com dados:', userData);

    const user = new UserBase(userData);
    await user.save();

    console.log('Usuário salvo no banco de dados:', user);

    return user;
  } catch (error) {
    console.error('Erro no authService.registerClient:', error);
    throw error; // Repassa o erro para o controlador
  }
};


const registerEmployee = async (employeeData) => {
  try {
    console.log('Iniciando registro no authService.registerEmployee');
    console.log('Dados do funcionário:', employeeData);

    // Verificar se o email já está em uso
    const existingUser = await UserBase.findOne({ email: employeeData.email });
    if (existingUser) {
      console.log('Email já está em uso:', employeeData.email);
      throw new Error('Email já está em uso.');
    }

    // Criptografar a senha
    console.log('Criptografando a senha');
    const salt = await bcrypt.genSalt(10);
    employeeData.password = await bcrypt.hash(employeeData.password, salt);

    // Não é necessário definir o 'kind' ou '__t'; o Mongoose faz isso automaticamente

    console.log('Criando novo Employee com dados:', employeeData);

    // Criar o funcionário
    const employee = new Employee(employeeData);
    await employee.save();

    console.log('Funcionário salvo no banco de dados:', employee);

    return employee;
  } catch (error) {
    console.error('Erro no authService.registerEmployee:', error);
    throw error; // Repassa o erro para o controlador
  }
};




const login = async (email, password) => {
  try {
    console.log('Iniciando authService.login para o email:', email);

    const user = await UserBase.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado com o email:', email);
      throw new Error('Email ou senha inválidos.');
    }

    console.log('Usuário encontrado:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Senha incorreta para o email:', email);
      throw new Error('Email ou senha inválidos.');
    }

    console.log('Senha correta, gerando token');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Token gerado:', token);

    return { token, user: { id: user._id, role: user.role, name: user.name, email: user.email } };
  } catch (error) {
    console.error('Erro no authService.login:', error);
    throw error;
  }
};


const getUserById = async (id) => {
  const user = await UserBase.findById(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }
  return user;
};

module.exports = {
  registerClient,
  registerEmployee,
  login,
  getUserById,
};
