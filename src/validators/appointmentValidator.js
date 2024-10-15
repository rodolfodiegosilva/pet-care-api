// validators/appointmentValidator.js

const Joi = require('joi');

const appointmentSchema = Joi.object({
  pet: Joi.string().required(),
  client: Joi.string().required(),
  employee: Joi.string().required(),
  service: Joi.string().required(),
  date: Joi.date().iso().min('now').required(),
  status: Joi.string().valid('scheduled', 'completed', 'canceled').default('scheduled'),
  notes: Joi.string().allow('', null),
});

const validateAppointmentData = (data, isUpdate = false) => {
  if (isUpdate) {
    return appointmentSchema.min(1).validate(data);
  }
  return appointmentSchema.validate(data);
};

module.exports = { validateAppointmentData };
