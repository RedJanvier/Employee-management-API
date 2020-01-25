const express = require('express');
const testConnection = require('./config/database')();

const app = express();

app.route('/api/v1', (req, res, next) => {
    res.status(200).json({ success: true, message: 'Successfully connected to the API' });
});

module.exports = app;