const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const sendMail = async ({ mailserver, mail }) => {
    let transporter = nodemailer.createTransport(mailserver);
    let info = await transporter.sendMail(mail);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

exports.signToken = (data, secret, duration = null) => {
    const token = jwt.sign(data, secret, duration);
    return token;
};
exports.verifyToken = (token, secret) => {
    const data = jwt.verify(token, secret);
    return data;
};

exports.checkAge = birthday => {
    // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
};

exports.sendEmail = async (type, to) => {
    let mail;
    if (type === 'confirmation') {
        mail = {
            from: 'manager@company.org',
            to,
            subject: `${type} - Verify your Email`,
            html: `
            <p>Dear ${to}, </p>
            <p>This is a confirmation email and to confirm; <b>Please click the link below: </b></p>
            <h2><a href="http://localhost:4000/api/v1/managers/confirm/${this.signToken(
                    to,
                    process.env.JWT_CONFIRMATION_SECRET
                )}">Confirmation Email Link</a></h2>
            <p><b>The confirmation link is valid for 15 minutes</b></p>`
        };
    }
    if (type === 'communication') {
        mail = {
            from: 'manager@company.org',
            to,
            subject: `${type} - Joined the Company`,
            html: `
            <p>Dear ${to}, </p>
            <p>It is with great pleasure, we inform you that you have successfully joined 
            The Company today. We invite you to be part of one of our best team and to favor
            hardwork and to be at the office in Rwanda tomorrow morning at 7am.</p>
            <p>Looking forward for your active participation.</p>
            <p>Regards</p>
            <p>Manager</p>`
        };
    }
    if (type === 'password reset') {
        mail = {
            from: 'manager@company.org',
            to,
            subject: `${type}`,
            html: `
            <p>Dear ${to}, </p>
            <p><b>Please click the link below to reset your password </b></p>
            <h2><a href="http://localhost:4000/api/v1/managers/reset/${this.signToken(
                    to,
                    process.env.JWT_CONFIRMATION_SECRET
                )}">Password Reset Link</a></h2>
            <p><b>The password reset link is valid for 5 minutes</b></p>`
        };
    }

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
        mail
    };

    return await sendMail(config).catch(err => {
        console.error(err);
        throw err;
    });
};

exports.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
exports.decryptPassword = async (password, hash) => {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
};

exports.uploadXL = (req) => {
    if (!req.files) {
        console.log('No files were uploaded.');
        return false;
    }

    const sampleFile = req.files.employees;

    const uploadPath = __dirname + '/uploads/' + sampleFile.name;

    return sampleFile.mv(uploadPath, err => {
        if (err) {
            console.log(err);
            return false;
        }

        return true;
    });
};