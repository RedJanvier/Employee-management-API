const express = require('express');
const testConnection = require('./config/database')();

const app = express();

app.use(express.json());

app.use('/api/v1/employees', require('./routes/employees'));

module.exports = app;