const Sequelize = require('sequelize');
exports.conn = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: false
    }
});

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
