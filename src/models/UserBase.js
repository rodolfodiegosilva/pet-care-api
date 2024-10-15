const mongoose = require('mongoose');

const userBaseOptions = {
  discriminatorKey: '__type', // Usando '__type' para corresponder ao banco de dados
  collection: 'users',
};

const UserBaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['client', 'employee'],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  userBaseOptions
);

// Middleware para atualizar 'updatedAt' antes de salvar
UserBaseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserBase', UserBaseSchema);
