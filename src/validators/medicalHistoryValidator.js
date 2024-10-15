const { body } = require('express-validator');

const validateMedicalRecord = [
  body('date').optional().isISO8601().withMessage('Data inválida'),
  body('description').notEmpty().withMessage('A descrição é obrigatória'),
];

module.exports = { validateMedicalRecord };
