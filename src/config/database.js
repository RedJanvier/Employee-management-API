import { config } from 'dotenv';
import Sequelize from 'sequelize';

config();
const env = process.env.NODE_ENV.toUpperCase();
export const conn = new Sequelize(process.env[`${env}_DATABASE_URL`], {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: false,
  },
});

export const testConnection = () => {
  Sequelize.authenticate()
    .then(console.log('Connection to the database was successful.'))
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
};
