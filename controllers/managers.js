const db = require('../config/database').conn;
const Manager = require('../models/managers');
const utils = require('../utils/employees');

// @desc    Create a manager
// Route    POST /api/v1/managers/signup
// Access   Public
exports.create = (req, res) => {
    db.sync({ logging: false })
        .then(async () => {
            try {
                const manager = await Manager.create({
                    ...req.body,
                    password: await utils.encryptPassword(req.body.password)
                });

                await utils.sendEmail(
                    'confirmation email',
                    manager.email,
                    true
                );

                return res.status(201).json({
                    success: true,
                    message: `Please check your inbox to confirm your email!`
                });
            } catch (error) {
                return res.status(400).json({
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
    const email = utils.verifyToken(
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

                await utils.sendEmail('communication', email);

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

// @desc    Login a manager
// Route    POST /api/v1/managers/login
// Access   Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    db.sync({ logging: false })
        .then(async () => {
            try {
                let token;
                const manager = await Manager.findOne({ where: { email } });

                if (!manager.dataValues) {
                    throw new Error(`Manager doesn't exist!`);
                }
                const isValid = await utils.decryptPassword(
                    password,
                    manager.dataValues.password
                );
                if (isValid) {
                    token = utils.signToken(
                        {
                            name: manager.dataValues.name,
                            uuid: manager.dataValues.uuid,
                            email: manager.dataValues.email,
                            status: manager.dataValues.status
                        },
                        process.env.JWT_LOGIN_SECRET,
                        '3h'
                    );
                } else {
                    throw new Error('Email or Password incorrect!');
                }

                return res.status(200).json({
                    success: true,
                    data: token
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    data: error.message
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: 'Error occurred on the server;'
            });
        });
};
