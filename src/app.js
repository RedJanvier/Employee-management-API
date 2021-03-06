import 'colors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import express, { json } from 'express';
import fileUpload from 'express-fileupload';

import routes from './routes';
import { errorHandler } from './middlewares';

config();
const app = express();
const { PORT } = process.env;

app.use(json());
app.use(helmet());
app.use(fileUpload());
app.use(morgan('dev'));

app.use('/api/v1', routes);
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(`Server started at http://localhost:${PORT}/api/v1/`)
);

export { app, server };
