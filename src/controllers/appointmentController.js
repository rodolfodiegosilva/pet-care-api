// controllers/appointmentController.js

const appointmentService = require('../services/appointmentService');

const createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body, req.user);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Compromisso não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientId } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (clientId) filters.client = clientId;

    const appointments = await appointmentService.getAllAppointments(filters, page, limit);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
    if (!appointment) {
      return res.status(404).json({ message: 'Compromisso não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Compromisso não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.deleteAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Compromisso não encontrado' });
    }
    res.json({ message: 'Compromisso excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
};
