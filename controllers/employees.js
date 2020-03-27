const { QueryTypes, Op } = require('sequelize');
const db = require('../config/database').conn;
const Employee = require('../models/employees');
const utils = require('../utils/employees');
const xlsx = require('xlsx');
const path = require('path');
// @desc    Create an employee
// Route    POST /api/v1/employees
// Access   Public
exports.create = (req, res) => {
    db.sync({ logging: false })
        .then(async () => {
            try {
                const employee = await Employee.create(req.body);

                await utils.sendEmail('communication', employee.email);

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
// Access   Public
exports.createMany = async (req, res) => {
    try {
        await utils.uploadXL(req);
        setTimeout(() => {
            const wb = xlsx.readFile(
                path.resolve(__dirname, '../uploads/', 'Boo21.xlsx'),
                { cellDates: true }
            );
            const ws = wb.Sheets.Sheet1;
            const employeesList = xlsx.utils.sheet_to_json(ws).map(entry => ({
                name: entry.name,
                email: entry.email,
                phone: entry.phone,
                nid: entry.nid,
                position: entry.position,
                birthday: entry.birthday,
                status: entry.status
            }));
            console.log(employeesList);
            res.status(200).json('Successfully stored employees list');
        }, 100);
    } catch (error) {
        console.log(error);
        res.status(500).json('Unsuccessful! Unable to store employees list');
    }

    // db.sync({ logging: false })
    //     .then(async () => {
    //         try {
    //             const employee = await Employee.create(req.body);

    //             await utils.sendEmail('communication', employee.email);

    //             return await res.status(201).json({
    //                 success: true,
    //                 message: `Employee ${employee.name} successfully created`
    //             });
    //         } catch (error) {
    //             await res.status(400).json({
    //                 success: false,
    //                 message: error.errors[0].message
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             success: false,
    //             message: 'Employee not created'
    //         });
    //     });
};

// @desc    Delete an employee
// Route    DELETE /api/v1/employees/:id
// Access   Public
exports.delete = async (req, res) => {
    const { uuid } = req.params;
    try {
        const employee = await Employee.destroy({ where: { uuid } });

        if (employee === 0) {
            throw new Error('Employee not found');
        }

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
// Access   Public
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
// Access   Public
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
// Route    PUT /api/v1/employees/search
// Access   Public
exports.search = (req, res) => {
    Object.keys(req.query).map(async q => {
        try {
            let where = {};
            where[q] = {
                [Op.like]: `%${req.query[q]}%`
            };

            const employees = await Employee.findAll({ where });

            if (employees.length < 1)
                throw new Error(`No employee found of that ${q}`);
            // console.log(employees);
            await res.status(200).json({
                success: true,
                data: employees.map(employee => ({
                    ...employee.dataValues,
                    password: null
                }))
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    });
};
