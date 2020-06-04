import { config } from 'dotenv';
import Sequelize from 'sequelize';

config();
export const conn = new Sequelize(process.env.DATABASE_URL, {
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
