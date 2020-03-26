const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sendMail = async ({ mailserver, mail }) => {
    let transporter = nodemailer.createTransport(mailserver);
    let info = await transporter.sendMail(mail);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

exports.signToken = (data, secret, duration) => {
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

exports.sendEmail = async (type, to, toConfirm = false) => {
    let mail = {
        from: 'manager@company.org',
        to,
        subject: `${type} - Joined the Company`,
        html: !toConfirm
            ? `
            <p>Dear ${to}, </p>
            <p>It is with great pleasure, we inform you that you have successfully joined 
            The Company today. We invite you to be part of one of our best team and to favor
            hardwork and to be at the office in Rwanda tomorrow morning at 7am.</p>
            <p>Looking forward for your active participation.</p>
            <p>Regards</p>
            <p>Manager</p>`
            : `
            <p>Dear ${to}, </p>
            <p>This is a confirmation email and to confirm; <b>Please click the link below: </b></p>
            <h2><a href="http://localhost:4000/api/v1/managers/confirm/${this.signToken(
                to,
                process.env.JWT_CONFIRMATION_SECRET,
                60 * 15
            )}">Confirmation Email Link</a></h2>
            <p><b>The confirmation link is valid for 15 minutes</b></p>
            <p>Regards</p>
            <p>Manager</p>`
    };
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

    return await sendMail(config).catch(console.error);
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
