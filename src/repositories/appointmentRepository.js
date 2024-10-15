// repositories/appointmentRepository.js

const Appointment = require('../models/Appointment');

const createAppointment = async (appointmentData) => {
  try {
    const appointment = new Appointment(appointmentData);
    return await appointment.save();
  } catch (error) {
    throw new Error(`Erro ao criar o compromisso: ${error.message}`);
  }
};
const isEmployeeAvailable = async (employeeId, scheduledDate) => {
  const conflictingAppointment = await Appointment.findOne({
    employee: employeeId,
    scheduledDate: scheduledDate,
    status: { $ne: 'Cancelado' },
  });
  return !conflictingAppointment;
};

const findAppointmentById = async (id) => {
  try {
    return await Appointment.findById(id)
      .populate('pet', 'name species')
      .populate('client', 'name email')
      .populate('employee', 'name role')
      .populate('service', 'name price');
  } catch (error) {
    throw new Error(`Erro ao buscar o compromisso: ${error.message}`);
  }
};

const findAllAppointments = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  try {
    return await Appointment.find(filters)
      .populate('pet', 'name species')
      .populate('client', 'name email')
      .populate('employee', 'name role')
      .populate('service', 'name price')
      .skip(skip)
      .limit(limit);
  } catch (error) {
    throw new Error(`Erro ao buscar os compromissos: ${error.message}`);
  }
};

const updateAppointment = async (id, updateData) => {
  try {
    return await Appointment.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Erro ao atualizar o compromisso: ${error.message}`);
  }
};

const updateAppointmentStatus = async (id, status) => {
  try {
    return await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  } catch (error) {
    throw new Error(`Erro ao atualizar o status do compromisso: ${error.message}`);
  }
};

const deleteAppointment = async (id) => {
  try {
    return await Appointment.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Erro ao deletar o compromisso: ${error.message}`);
  }
};

module.exports = {
  createAppointment,
  isEmployeeAvailable,
  findAppointmentById,
  findAllAppointments,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
