import { resolve } from 'path';
import { readFile, utils } from 'xlsx';
import { sign, verify } from 'jsonwebtoken';
import { genSalt, hash as _hash, compare } from 'bcrypt';
import { createTransport, getTestMessageUrl } from 'nodemailer';

const sendMail = ({ mailserver, mail }) => {
  const transporter = createTransport(mailserver);
  const info = transporter.sendMail(mail);
  return console.log(`Preview: ${getTestMessageUrl(info)}`);
};

const _signToken = (data, secret, duration = null) => {
  const tokenOptions = duration ? { expiresIn: duration } : null;
  const token = sign(data, secret, tokenOptions);
  return token;
};
export { _signToken as signToken };
export const verifyToken = (token, secret) => {
  const data = verify(token, secret);
  return data;
};

export const checkAge = (birthday) => {
  // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age;
};

export const sendEmail = async (type, to) => {
  let mail;
  if (type === 'confirmation') {
    mail = {
      from: 'manager@company.org',
      to,
      subject: `${type} - Verify your Email`,
      html: `
            <p>Dear ${to}, </p>
            <p>This is a confirmation email and to confirm; <b>Please click the link below: </b></p>
            <h2><a href="http://localhost:4000/api/v1/managers/confirm/${_signToken(
              to,
              process.env.JWT_CONFIRMATION_SECRET
            )}">Confirmation Email Link</a></h2>
            <p><b>The confirmation link is valid for 15 minutes</b></p>`,
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
            <p>Manager</p>`,
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
            <h2><a href="http://localhost:4000/api/v1/managers/reset/${_signToken(
              to,
              process.env.JWT_CONFIRMATION_SECRET
            )}">Password Reset Link</a></h2>
            <p><b>The password reset link is valid for 5 minutes</b></p>`,
    };
  }

  const config = {
    mailserver: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
      },
    },
    mail,
  };

  return sendMail(config);
};

export const encryptPassword = async (password) => {
  const salt = await genSalt(12);
  const hash = await _hash(password, salt);
  return hash;
};
export const decryptPassword = async (password, hash) => {
  const isValid = await compare(password, hash);
  return isValid;
};

export const uploadXL = (req) => {
  if (!req.files) {
    console.log('No files were uploaded.');
    return false;
  }

  const sampleFile = req.files.employees;

  const uploadPath = resolve(__dirname, '../uploads/', 'Boo21.xlsx');

  return sampleFile.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
      return false;
    }

    return true;
  });
};

export const readXL = () => {
  const wb = readFile(resolve(__dirname, '../uploads/', 'Boo21.xlsx'), {
    cellDates: true,
  });
  const ws = wb.Sheets.Sheet1;
  const employeesList = utils.sheet_to_json(ws).map((entry) => ({
    name: entry.name,
    email: entry.email,
    phone: entry.phone,
    nid: entry.nid,
    position: entry.position,
    birthday: `${entry.birthday.split('/')[2]}-${
      entry.birthday.split('/')[1]
    }-${entry.birthday.split('/')[0]}`,
    status: entry.status,
  }));
  return employeesList;
};

// eslint-disable-next-line
export const managerLog = (type, payload = null) => {
  switch (type) {
    case 'reset':
      return console.log(
        `===== MANAGER LOG: ${
          payload.manager
        } did reset his/her password at ${new Date(Date.now())} ======`
      );
    case 'login':
      return console.log(
        `===== MANAGER LOG: ${
          payload.manager
        } logged into his account at ${new Date(Date.now())} ======`
      );
    case 'create':
      return console.log(
        `===== MANAGER LOG: ${payload.manager} created a new employee ${
          payload.employee
        } at ${new Date(Date.now())} ======`
      );
    case 'edit':
      return console.log(
        `===== MANAGER LOG: ${payload.manager} ${type}d ${
          payload.employee
        } ${new Date(Date.now())} ======`
      );
    case 'status':
      return console.log(
        `===== MANAGER LOG: ${payload.manager} ${payload.status}d ${
          payload.employee
        } at ${new Date(Date.now())} ======`
      );
    case 'search':
      return console.log(
        `===== MANAGER LOG: ${
          payload.manager
        } searched for employees at ${new Date(Date.now())} ======`
      );
    default:
  }
};
