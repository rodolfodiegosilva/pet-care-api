// repositories/serviceRepository.js

const Service = require('../models/Service');

const createService = async (serviceData) => {
  try {
    const service = new Service(serviceData);
    return await service.save();
  } catch (error) {
    throw new Error(`Erro ao criar o serviço: ${error.message}`);
  }
};

const findAllServices = async () => {
  try {
    return await Service.find();
  } catch (error) {
    throw new Error(`Erro ao buscar os serviços: ${error.message}`);
  }
};

const findServiceById = async (id) => {
  try {
    return await Service.findById(id);
  } catch (error) {
    throw new Error(`Erro ao buscar o serviço: ${error.message}`);
  }
};

const updateService = async (id, updateData) => {
  try {
    return await Service.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    throw new Error(`Erro ao atualizar o serviço: ${error.message}`);
  }
};

const deleteService = async (id) => {
  try {
    return await Service.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Erro ao deletar o serviço: ${error.message}`);
  }
};

module.exports = {
  createService,
  findAllServices,
  findServiceById,
  updateService,
  deleteService,
};
