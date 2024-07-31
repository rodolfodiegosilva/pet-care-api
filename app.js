const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./src/routes');
const setupSwagger = require('./src/config/swagger');

dotenv.config();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('Connection error', err.message);
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
}

app.use(routes);

setupSwagger(app);

module.exports = app;
