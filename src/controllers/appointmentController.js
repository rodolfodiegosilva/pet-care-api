// controllers/appointmentController.js

const appointmentService = require('../services/appointmentService');

const createAppointment = async (req, res) => {
  try {
    // Validação dos dados de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Dados inválidos', errors: errors.array() });
    }

    const { role: userRole, id: userId } = req.user;
    let clientId;

    if (userRole === 'employee') {
      clientId = req.body.clientId;
      if (!clientId) {
        return res.status(400).json({ message: 'O campo clientId é obrigatório para funcionários.' });
      }
    } else if (userRole === 'client') {
      clientId = userId;
    } else {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Verificar se o pet pertence ao cliente
    const pet = await petService.getPetById(req.body.petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado' });
    }
    const ownerId = pet.owner._id ? pet.owner._id.toString() : pet.owner.toString();
    if (ownerId !== clientId) {
      return res.status(400).json({ message: 'O pet não pertence ao cliente especificado' });
    }

    // Continuar com a criação do agendamento
    const appointmentData = { ...req.body, client: clientId };
    const appointment = await appointmentService.createAppointment(appointmentData);

    res.status(201).json({ message: 'Agendamento criado com sucesso', data: appointment });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro ao criar agendamento' });
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
