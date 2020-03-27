const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const middlewares = require('./middlewares/employees');

const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(morgan('dev'));

app.use(
    '/api/v1/employees',
    middlewares.checkAuth,
    require('./routes/employees')
);
app.use('/api/v1/managers', require('./routes/managers'));

module.exports = app;
