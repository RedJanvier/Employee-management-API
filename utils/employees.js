const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const sendMail = async ({ mailserver, mail }) => {
    let transporter = nodemailer.createTransport(mailserver);
    let info = await transporter.sendMail(mail);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
};

exports.checkAge = birthday => {
    // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
};

exports.sendEmail = async (type, to) => {
    let mail = {
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
