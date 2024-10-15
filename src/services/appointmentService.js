// services/appointmentService.js

const appointmentRepository = require('../repositories/appointmentRepository');
const { validateAppointmentData } = require('../validators/appointmentValidator');
const Pet = require('../models/Pet');
const Service = require('../models/Service');
const Employee = require('../models/Employee');
const Appointment = require('../models/Appointment');

const createAppointment = async (appointmentData, user) => {
  // Validação dos dados do compromisso
  const { error } = validateAppointmentData(appointmentData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  // Verificar se o serviço existe e está ativo
  const service = await Service.findById(appointmentData.service);
  if (!service || !service.active) {
    throw new Error('Serviço inválido ou inativo.');
  }

  // Verificar se o funcionário existe
  const employee = await Employee.findById(appointmentData.employee);
  if (!employee) {
    throw new Error('Funcionário inválido.');
  }

  // Verificar conflitos de horário
  const conflict = await Appointment.findOne({
    employee: appointmentData.employee,
    date: appointmentData.date,
  });
  if (conflict) {
    throw new Error('O funcionário já possui um compromisso neste horário.');
  }

  // Verificar permissões
  if (user.role === 'client') {
    // Cliente só pode agendar para si mesmo
    if (appointmentData.client !== user._id.toString()) {
      throw new Error('Você não pode agendar para outro cliente.');
    }

    // Verificar se o pet pertence ao cliente
    const pet = await Pet.findById(appointmentData.pet);
    if (!pet || pet.owner.toString() !== user._id.toString()) {
      throw new Error('Você não pode agendar com um pet que não lhe pertence.');
    }
  }

  // Criar o agendamento
  return await appointmentRepository.createAppointment(appointmentData);
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.findAppointmentById(id);
};

const getAllAppointments = async (filters, page, limit) => {
  return await appointmentRepository.findAllAppointments(filters, page, limit);
};

const updateAppointment = async (id, updateData) => {
  // Validação dos dados de atualização
  const { error } = validateAppointmentData(updateData, true); // true para atualização parcial
  if (error) {
    throw new Error(error.details[0].message);
  }
  return await appointmentRepository.updateAppointment(id, updateData);
};

const cancelAppointment = async (id) => {
  return await appointmentRepository.updateAppointmentStatus(id, 'canceled');
};

const deleteAppointment = async (id) => {
  return await appointmentRepository.deleteAppointment(id);
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
};
