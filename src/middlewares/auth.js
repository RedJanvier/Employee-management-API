import { verifyToken, ErrorResponse } from '../utils';
import asyncHandler from './async';

// eslint-disable-next-line
export const checkAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : req.headers.authorization;

  switch (true) {
    case token === undefined:
      throw new ErrorResponse(
        'unauthorised to use this resource, please signup/login',
        401
      );

    case token !== null:
      req.decoded = verifyToken(token, process.env.JWT_LOGIN_SECRET);
      return next();

    default:
      break;
  }
});
