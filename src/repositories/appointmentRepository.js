const Appointment = require('../models/Appointment');

const createAppointment = async (appointmentData) => {
  const appointment = new Appointment(appointmentData);
  return await appointment.save();
};

const findAppointmentById = async (id) => {
  return await Appointment.findById(id)
    .populate('pet')
    .populate('client')
    .populate('employee')
    .populate('service');
};

const findAllAppointments = async () => {
  return await Appointment.find()
    .populate('pet')
    .populate('client')
    .populate('employee')
    .populate('service');
};

const updateAppointmentStatus = async (id, status) => {
  return await Appointment.findByIdAndUpdate(id, { status }, { new: true });
};

const deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

module.exports = {
  createAppointment,
  findAppointmentById,
  findAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
