// services/appointmentService.js

const appointmentRepository = require('../repositories/appointmentRepository');
const { validateAppointmentData } = require('../validators/appointmentValidator');
const Pet = require('../models/Pet');
const Service = require('../models/Service');
const Employee = require('../models/Employee');
const Appointment = require('../models/Appointment');

const createAppointment = async (appointmentData) => {
  // Verificar se o serviço existe

  const service = await serviceRepository.findServiceById(appointmentData.serviceId);
  if (!service) {
    throw new Error('Serviço não encontrado');
  }

  // Verificar disponibilidade dos funcionários para o serviço e horário
  const availableEmployees = await employeeService.getAvailableEmployeesForService(
    service._id,
    appointmentData.scheduledDate
  );
  if (availableEmployees.length === 0) {
    throw new Error('Não há funcionários disponíveis para este serviço no horário solicitado');
  }

  // Selecionar um funcionário (pode ser por lógica de distribuição)
  appointmentData.employee = availableEmployees[0]._id;

  // Criar o agendamento
  const appointment = await appointmentRepository.createAppointment(appointmentData);

  return appointment;
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
