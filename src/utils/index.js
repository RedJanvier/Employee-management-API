import { encryptPassword, decryptPassword } from './password';
import { signToken, verifyToken } from './token';
import ErrorResponse from './errorResponse';
import { uploadXL, readXL } from './excel';
import { managerLog } from './logger';
import { sendEmail } from './mail';

const checkAge = (birthday) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  return age;
};

export {
  checkAge,
  signToken,
  verifyToken,
  sendEmail,
  encryptPassword,
  decryptPassword,
  managerLog,
  readXL,
  uploadXL,
  ErrorResponse,
};
