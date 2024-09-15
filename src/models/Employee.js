const mongoose = require('mongoose');
const UserBase = require('./UserBase');

const EmployeeSchema = new mongoose.Schema({
  employeeType: {
    type: String,
    enum: ['attendant', 'veterinarian', 'salesperson', 'supervisor', 'manager'],
  },
  department: { type: String },
});

const Employee = UserBase.discriminator('Employee', EmployeeSchema);

module.exports = Employee;
