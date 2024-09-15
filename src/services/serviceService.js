const serviceRepository = require('../repositories/serviceRepository');

const createService = async (serviceData) => {
  return await serviceRepository.createService(serviceData);
};

const getServiceById = async (id) => {
  return await serviceRepository.findServiceById(id);
};

const getAllServices = async () => {
  return await serviceRepository.findAllServices();
};

const updateService = async (id, serviceData) => {
  return await serviceRepository.updateService(id, serviceData);
};

const deleteService = async (id) => {
  return await serviceRepository.deleteService(id);
};

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
