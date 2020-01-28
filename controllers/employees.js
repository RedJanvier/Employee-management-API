const nodemailer = require('nodemailer');
const db = require('../config/database').conn;
const Employee = require('../models/employees');

exports.create = (req, res) => {
    db.sync({ logging: false })
        .then(() =>  Employee.create(req.body))
        .then(employee => {
            res.status(201).json({
                success: true,
                message: `Employee ${employee.name} successfully created`
            });
            return employee;
        })
        .then(({ email, name }) => {
        // config for mailserver and mail, input your data
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
                to: `${email}`,
                subject: 'Communication - Joined the Company',
                html: `
                    <p>Dear ${name}, </p>
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
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                success: false,
                message: 'Server error. Employee not created.'
            });
        })
};