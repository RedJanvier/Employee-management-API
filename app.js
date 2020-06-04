require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const middlewares = require('./middlewares/employees');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(fileUpload());
app.use(morgan('dev'));

app.use(
    '/api/v1/employees',
    middlewares.checkAuth,
    require('./routes/employees')
);
app.use('/api/v1/managers', require('./routes/managers'));

app.listen(PORT, console.log(`Server started at http://localhost:${PORT}/api/v1/`));
