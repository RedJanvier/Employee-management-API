import { genSalt, hash as _hash, compare } from 'bcrypt';
import ErrorResponse from './errorResponse';

export const encryptPassword = async (password) => {
  const salt = await genSalt(12);
  const hash = await _hash(password, salt);
  return hash;
};

export const decryptPassword = async (password, hash) => {
  const isValid = await compare(password, hash);
  if (!isValid) throw new ErrorResponse('Email/Password Incorrect!', 403);
  return isValid;
};
