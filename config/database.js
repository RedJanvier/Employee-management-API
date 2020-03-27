const Sequelize = require('sequelize');
exports.conn = new Sequelize(
    process.env.NODE_ENV === 'development'
        ? process.env.POSTGRES_URI
        : process.env.DATABASE_URL
);

exports.testConnection = () => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection to the database was successful.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
};
