// models/Appointment.js

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'A data do compromisso não pode ser no passado.',
    },
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// Definição de índices
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ client: 1 });
appointmentSchema.index({ employee: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
