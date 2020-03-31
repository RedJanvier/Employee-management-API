const { QueryTypes, Op } = require('sequelize');
const db = require('../config/database').conn;
const Employee = require('../models/employees');
const utils = require('../utils/employees');

// @desc    Create an employee
// Route    POST /api/v1/employees
// Access   Private
exports.create = (req, res) => {
    db.sync({ logging: false })
        .then(async () => {
            try {
                const employee = await Employee.create(req.body);

                await utils.sendEmail('communication', employee.email);

                utils.managerLog('create', {
                    manager: req.decoded.name,
                    employee: employee.name
                });

                return await res.status(201).json({
                    success: true,
                    message: `Employee ${employee.name} successfully created`
                });
            } catch (error) {
                await res.status(400).json({
                    success: false,
                    message: error.errors[0].message
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Employee not created'
            });
        });
};

// @desc    Create many employees from excelsheet
// Route    POST /api/v1/employees/many
// Access   Private
exports.createMany = async (req, res) => {
    try {
        await utils.uploadXL(req);
        setTimeout(() => {
            const employeesList = utils.readXL();

            employeesList.map(async data => {
                try {
                    await db.sync({ logging: false });
                    const employee = await Employee.create(data);

                    utils.managerLog('create', {
                        manager: req.decoded.name,
                        employee: employee.name
                    });
                    await utils.sendEmail('communication', employee.email);

                    return employee;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            });

            res.status(200).json('Successfully stored employees list');
        }, 100);
    } catch (error) {
        console.log(error);
        res.status(500).json('Unsuccessful! Unable to store employees list');
    }
};

// @desc    Delete an employee
// Route    DELETE /api/v1/employees/:uuid
// Access   Private
exports.delete = async (req, res) => {
    const { uuid } = req.params;
    try {
        const employee = await Employee.destroy({ where: { uuid } });

        if (employee === 0) {
            throw new Error('Employee not found');
        }

        utils.managerLog('delete', {
            manager: req.decoded.name,
            employee: uuid
        });

        console.log(
            `===== MANAGER LOG: ${
                req.decoded.name
            } deleted ${uuid} at ${Date.now()} ======`
        );

        res.status(200).json({
            success: true,
            message: `${employee} Employees successfully deleted`
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Edit an employee
// Route    PUT /api/v1/employees/:id
// Access   Private
exports.edit = (req, res) => {
    const { uuid } = req.params;
    const { body } = req;

    db.sync({ logging: false })
        .then(async () => {
            try {
                const employee = await Employee.update(body, {
                    where: { uuid }
                });

                if (!employee[0]) {
                    throw new Error('Employee not created');
                }

                utils.managerLog('edit', {
                    manager: req.decoded.name,
                    employee: uuid
                });

                await res.status(200).json({
                    success: true,
                    message: `Employee successfully modified`
                });
            } catch (error) {
                await res.status(304).json({
                    success: false,
                    message: error.message
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Error occurred on the server; Employee not modified'
            });
        });
};

// @desc    Suspend/Activate an employee
// Route    PUT /api/v1/employees/:id/:status
// Access   Private
exports.status = (req, res) => {
    let { uuid, status } = req.params;
    if (status === 'activate' || status === 'suspend') {
        try {
            db.query(
                `UPDATE employees SET status = :status WHERE employees.uuid = :uuid`,
                {
                    replacements: {
                        status: status === 'activate' ? 'active' : 'inactive',
                        uuid: uuid
                    },
                    type: QueryTypes.UPDATE
                }
            ).then(() => {
                status === 'suspend' ? (status = 'suspende') : '';

                utils.managerLog('status', {
                    manager: req.decoded.name,
                    status,
                    employee: uuid
                });

                res.status(201).json({
                    success: true,
                    message: `Employee was ${status}d successfully`
                });
            });
        } catch (error) {
            console.log(error);
            res.status(304).json({
                success: false,
                message: 'Employee not activated'
            });
        }
    } else {
        res.status(404).json({
            success: false,
            message: 'Route does not exist'
        });
    }
};

// @desc    Search for employees
// Route    PUT /api/v1/employees/search/:page/:pageSize
// Access   Private
exports.search = async (req, res) => {
    const { page, pageSize } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    page && delete req.query.page;
    pageSize && delete req.query.pageSize;

    let where = {};
    Object.keys(req.query).map(async q => {
        where[q] = {
            [Op.iLike]: `%${req.query[q]}%`
        };
    });

    try {
        const employees = await Employee.findAll({ offset, limit, where });
        const all = await Employee.findAll({ where });

        utils.managerLog('search', {
            manager: req.decoded.name
        });

        return res.status(200).json({
            success: true,
            found: all.length,
            data: employees.map(employee => ({
                ...employee.dataValues,
                password: null
            }))
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
