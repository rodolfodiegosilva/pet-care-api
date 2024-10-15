const mongoose = require('mongoose');

// Definição do esquema para o histórico médico
const medicalHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserBase', // Assumindo que veterinários são usuários com papel 'employee' e tipo 'veterinarian'
    required: true,
  },
});

// Definição do esquema principal do Pet
const petSchema = new mongoose.Schema(
  {
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
      min: 0,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    microchipNumber: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserBase',
      required: true,
    },
    medicalHistory: [medicalHistorySchema],
    photos: [String],
    feedingInstructions: {
      type: String,
      trim: true,
    },
    behaviorNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Adicionar índice composto único
petSchema.index(
  { name: 1, species: 1, breed: 1, gender: 1, owner: 1 },
  { unique: true }
);


const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
