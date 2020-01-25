const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRES_URI);

const testConnection = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection to the database was successful.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}

module.exports = testConnection;
