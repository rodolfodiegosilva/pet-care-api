const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  veterinarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Veterinarian',
  }
});

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  species: {
    type: String,
    required: true,
    trim: true,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Macho', 'Fêmea'],
    required: true,
  },
  weight: {
    type: Number,
    required: false,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  microchipNumber: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  medicalHistory: {
    type: [medicalHistorySchema],
    required: false,
  },
  photos: {
    type: [String],
    required: false,
  },
  feedingInstructions: {
    type: String,
    required: false,
  },
  behaviorNotes: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

petSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
