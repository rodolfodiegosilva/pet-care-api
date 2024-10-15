const mongoose = require('mongoose');
const UserBase = require('./UserBase');

const EmployeeSchema = new mongoose.Schema({
  employeeType: {
    type: String,
    required: true,
    enum: ['supervisor', 'manager', 'cashier', 'veterinarian', 'driver', 'technician'],
  },
  department: { type: String },
  // Outros campos específicos...
});

// Criar o discriminador 'employee' baseado em 'UserBase'
const Employee = UserBase.discriminator('employee', EmployeeSchema);

module.exports = Employee;
