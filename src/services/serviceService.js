// services/serviceService.js

const serviceRepository = require('../repositories/serviceRepository');

const createService = async (serviceData) => {
  return await serviceRepository.createService(serviceData);
};

const getAllServices = async () => {
  return await serviceRepository.findAllServices();
};

const getServiceById = async (id) => {
  return await serviceRepository.findServiceById(id);
};

const updateService = async (id, updateData) => {
  return await serviceRepository.updateService(id, updateData);
};

const deleteService = async (id) => {
  return await serviceRepository.deleteService(id);
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
