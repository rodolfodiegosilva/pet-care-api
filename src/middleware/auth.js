const jwt = require('jsonwebtoken');
const UserBase = require('../models/UserBase');
const Employee = require('../models/Employee');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Iniciando authMiddleware');

    const authHeader = req.header('Authorization');

    if (!authHeader) {
      console.log('Token não fornecido');
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    console.log('Token recebido:', token);

    // Decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Token decodificado:', decoded);

    // Buscar o usuário no banco de dados
    let user = await UserBase.findById(decoded.id).exec();

    if (!user) {
      console.log('Usuário não encontrado com o ID:', decoded.id);
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    console.log('Usuário encontrado:', user);

    // Se o usuário for um funcionário, buscar informações adicionais
    if (user.role === 'employee') {
      user = await Employee.findById(decoded.id).exec();
      if (!user) {
        console.log('Funcionário não encontrado com o ID:', decoded.id);
        return res.status(401).json({ message: 'Funcionário não encontrado.' });
      }
      console.log('Dados do funcionário:', user);
    }

    // Definir req.user com os campos necessários
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    if (user.role === 'employee') {
      req.user.employeeType = user.employeeType;
      req.user.department = user.department;
    }

    console.log('req.user definido como:', req.user);

    next();
  } catch (error) {
    console.error('Erro no authMiddleware:', error);
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
