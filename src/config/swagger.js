const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerDocs');

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
