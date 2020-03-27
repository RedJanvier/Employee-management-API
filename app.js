const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.json());
app.use(fileUpload());

app.use('/api/v1/employees', require('./routes/employees'));
app.use('/api/v1/managers', require('./routes/managers'));

module.exports = app;
