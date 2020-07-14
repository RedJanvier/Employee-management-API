import { config as dotenvConfig } from 'dotenv';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import asyncHandler from '../middlewares/async';
import { signToken } from './token';

dotenvConfig();
const { JWT_CONFIRMATION_SECRET, MAIL, MAIL_PASS } = process.env;

export const sendMail = (mail) => {
  const mailserver = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: MAIL,
      pass: MAIL_PASS
    }
  };
  const transporter = createTransport(mailserver);
  const info = transporter.sendMail(mail);
  return console.log(`Preview: ${getTestMessageUrl(info)}`);
};

export const sendConfirmation = (type, to) => {
  const mail = {
    from: 'mamager@company.org',
    to,
    subject: `${type} - Verify your Email`,
    html: `<p>Dear ${to}, </p><p>This is a confirmation email and to confirm; <b>Please click the link below: </b></p><h2><a href="http://localhost:4000/api/v1/managers/confirm/${signToken(
      to,
      JWT_CONFIRMATION_SECRET
    )}">Confirmation Email Link</a></h2><p><b>The confirmation link is valid for 15 minutes</b></p>`
  };
  sendMail(mail);
};

export const sendCommunication = (type, to) => {
  const mail = {
    from: 'mamager@company.org',
    to,
    subject: `${type} - Joined the Company`,
    html: `<p>Dear ${to}, </p><p>It is with great pleasure, we inform you that you have successfully joined The Company today. We invite you to be part of one of our best team and to favorhardwork and to be at the office in Rwanda tomorrow morning at 7am.</p><p>Looking forward for your active participation.</p><p>Regards</p><p>Manager</p>`
  };
  sendMail(mail);
};

export const sendReset = (type, to) => {
  const mail = {
    from: 'mamager@company.org',
    to,
    subject: `${type}`,
    html: `<p>Dear ${to}, </p><p><b>Please click the link below to reset your password </b></p><h2><a href="http://localhost:4000/api/v1/managers/reset/${signToken(
      to,
      JWT_CONFIRMATION_SECRET
    )}">Password Reset Link</a></h2><p><b>The password reset link is valid for 5 minutes</b></p>`
  };
  sendMail(mail);
};

export const sendEmail = asyncHandler(async (type, to) => {
  switch (type) {
    case 'confirmation':
      sendConfirmation(type, to);
      break;
    case 'communication':
      sendCommunication(type, to);
      break;
    case 'password reset':
      sendReset(type, to);
      break;
    default:
  }
});
