const { body } = require('express-validator');

const validatePet = [
  body('name').notEmpty().withMessage('O nome é obrigatório'),
  body('species').notEmpty().withMessage('A espécie é obrigatória'),
  body('breed').notEmpty().withMessage('A raça é obrigatória'),
  body('gender').isIn(['Macho', 'Fêmea']).withMessage('O gênero deve ser "Macho" ou "Fêmea"'),
  body('birthDate').isISO8601().withMessage('Data de nascimento inválida'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('O peso deve ser um número positivo'),
  // Adicione validações adicionais conforme necessário
];

module.exports = { validatePet };
