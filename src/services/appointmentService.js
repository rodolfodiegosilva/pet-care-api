const appointmentRepository = require('../repositories/appointmentRepository');

const createAppointment = async (appointmentData) => {
  return await appointmentRepository.createAppointment(appointmentData);
};

const getAppointmentById = async (id) => {
  return await appointmentRepository.findAppointmentById(id);
};

const getAllAppointments = async () => {
  return await appointmentRepository.findAllAppointments();
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
  cancelAppointment,
  deleteAppointment,
};
