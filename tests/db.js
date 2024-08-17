const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connect = async () => {

  if (mongoServer) {
    await mongoServer.stop();
  }

  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

const close = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

const clear = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    if (collections.hasOwnProperty(key)) {
      await collections[key].deleteMany();
    }
  }
};

module.exports = {
  connect,
  close,
  clear,
};
