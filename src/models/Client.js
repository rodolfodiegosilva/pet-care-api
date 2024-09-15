const mongoose = require('mongoose');
const UserBase = require('./UserBase');

const ClientSchema = new mongoose.Schema({
  clientType: {
    type: String,
    enum: ['new', 'active', 'inactive'],
    default: 'new'
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
});

const Client = UserBase.discriminator('Client', ClientSchema);

module.exports = Client;
