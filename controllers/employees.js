const db = require('../config/database').conn;
const Employee = require('../models/employees');

exports.create = (req, res) => {
    db.sync()
        .then(async() => await Employee.create(req.body))
        .then(({ name }) => {
            res.status(201).json({
                success: true,
                message: `Employee ${name} successfully created`
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                success: false,
                message: 'Server error. Employee not created.'
            });
        })
};