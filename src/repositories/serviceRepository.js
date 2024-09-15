const Service = require('../models/Service');

const createService = async (serviceData) => {
  const service = new Service(serviceData);
  return await service.save();
};

const findServiceById = async (id) => {
  return await Service.findById(id);
};

const findAllServices = async () => {
  return await Service.find();
};

const updateService = async (id, serviceData) => {
  return await Service.findByIdAndUpdate(id, serviceData, { new: true, runValidators: true });
};

const deleteService = async (id) => {
  return await Service.findByIdAndDelete(id);
};

module.exports = {
  createService,
  findServiceById,
  findAllServices,
  updateService,
  deleteService,
};
