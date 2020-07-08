import { sign, verify } from 'jsonwebtoken';

export const signToken = (data, secret, duration = null) => {
  const tokenOptions = duration ? { expiresIn: duration } : undefined;
  const token = sign(data, secret, tokenOptions);
  return token;
};
export const verifyToken = (token, secret) => {
  const data = verify(token, secret);
  return data;
};
