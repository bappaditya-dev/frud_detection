const express = require('express');
const app = express();
const fraudRoutes = require('./routes/fraudRoutes');
const setupSwagger = require('./utils/swagger');

app.use(express.json());
app.use('/', fraudRoutes);
setupSwagger(app);

module.exports = app;
