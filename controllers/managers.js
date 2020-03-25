// const { QueryTypes, Op } = require('sequelize');
const db = require('../config/database').conn;
const Manager = require('../models/managers');
const utils = require('../utils/employees');
const jwt = require('jsonwebtoken');

// @desc    Create a manager
// Route    POST /api/v1/managers/signup
// Access   Public
exports.create = (req, res) => {
    db.sync({ logging: false })
        .then(async () => {
            try {
                const manager = await Manager.create(req.body);

                await utils.sendEmail(
                    'confirmation email',
                    manager.email,
                    true
                );

                return await res.status(201).json({
                    success: true,
                    message: `Manager ${manager.name} successfully created`
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
                message: 'Manager not created'
            });
        });
};

// @desc    Confirm a manager from email
// Route    GET /api/v1/managers/confirm/:confirmationToken
// Access   Private
exports.confirm = async (req, res) => {
    const { confirmationToken } = req.params;
    const email = jwt.verify(
        confirmationToken,
        process.env.JWT_CONFIRMATION_SECRET
    );

    db.sync({ logging: false })
        .then(async () => {
            try {
                const manager = await Manager.update(
                    { confirmed: true },
                    {
                        where: { email }
                    }
                );

                if (!manager[0]) {
                    throw new Error(`Manager's email not confirmed`);
                }

                await res.status(200).json({
                    success: true,
                    message: `Thank you for confirming your email!`
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
                message: 'Error occurred on the server; Email not confirmed'
            });
        });
};
