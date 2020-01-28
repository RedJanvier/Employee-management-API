const Sequelize = require('sequelize');
exports.conn = new Sequelize(process.env.POSTGRES_URI);

exports.testConnection = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection to the database was successful.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}
