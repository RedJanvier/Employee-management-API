import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import express, { json } from 'express';
import fileUpload from 'express-fileupload';

import managerRoutes from './routes/managers';
import employeeRoutes from './routes/employees';
import { checkAuth } from './middlewares/employees';

config();
const app = express();
const { PORT } = process.env;

app.use(json());
app.use(helmet());
app.use(fileUpload());
app.use(morgan('dev'));

app.use('/api/v1/managers', managerRoutes);
app.use('/api/v1/employees', checkAuth, employeeRoutes);

app.listen(
  PORT,
  console.log(`Server started at http://localhost:${PORT}/api/v1/`)
);
