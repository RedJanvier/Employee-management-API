const express = require('express');
const app = express();

app.get('/api/v1', (req, res, next) => {
    res.status(200).json({ success: true, message: 'Successfully connected to the API' });
});

module.exports = app;