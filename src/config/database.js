import { config } from 'dotenv';
import Sequelize from 'sequelize';

config();
const { DATABASE_URL } = process.env;
export const conn = new Sequelize(DATABASE_URL, {
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
