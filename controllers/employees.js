const nodemailer = require('nodemailer');
const { QueryTypes, Op } = require('sequelize');
const db = require('../config/database').conn;
const Employee = require('../models/employees');
const utils = require('../utils/employees');

// @desc    Create an employee
// Route    POST /api/v1/employees
// Access   Public
exports.create = (req, res) => {
    db.sync({ logging: false })
        .then(async() => {

            try {
                const employee = await Employee.create(req.body);
                
                const config = {
                    mailserver: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.MAIL,
                            pass: process.env.MAIL_PASS
                        }
                    },
                    mail: {
                        from: 'manager@company.org',
                        to: `${employee.email}`,
                        subject: 'Communication - Joined the Company',
                        html: `
                            <p>Dear ${employee.name}, </p>
                            <p>It is with great pleasure, we inform you that you have successfully joined 
                            The Company today. We invite you to be part of one of our best team and to favor
                            hardwork and to be at the office in Rwanda tomorrow morning at 7am.</p>
                            <p>Looking forward for your active participation.</p>
                            <p>Regards</p>
                            <p>Manager</p>`
                    }
                };
                
                const sendMail = async ({ mailserver, mail }) => {
                    let transporter = nodemailer.createTransport(mailserver);
                    let info = await transporter.sendMail(mail);
                    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
                };
                sendMail(config).catch(console.error);
                
                res.status(201).json({
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

// @desc    Delete an employee
// Route    DELETE /api/v1/employees/:id
// Access   Public
exports.delete = async (req, res) => {
    const { uuid } = req.params;
    try {

        const employee = await Employee.destroy({ where: { uuid } });

        if(employee === 0) { throw new Error('Employee not found'); }

        res.status(200).json({ 
            success: true,
            message: `${employee} Employees successfully deleted`
        });

    } catch(err) {

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
    .then(async() => {
        try {
    
            const employee = await Employee.update(body, { where: { uuid } });
            
            if (!employee[0]) { throw new Error('Employee not created'); }

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
exports.status = (req, res )=> {
    let { uuid, status } = req.params;
    if (status === 'activate' || status === 'suspend'){
        try {
            db.query(`UPDATE employees SET status = :status WHERE employees.uuid = :uuid`, { 
            replacements: { 
                status: (status === 'activate')? 'active' : 'inactive',
                uuid: uuid
            }, type: QueryTypes.UPDATE })
            .then(() => {
                (status === 'suspend')? status = 'suspende': '';
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
            
            if (employees.length < 1) throw new Error(`No employee found of that ${q}`);

            await res.status(200).json({
                success: true,
                employees
            });

        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    });
};