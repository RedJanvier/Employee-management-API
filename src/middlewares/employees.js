import { verifyToken } from '../utils/employees';

// eslint-disable-next-line
export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : req.headers.authorization;

    switch (true) {
      case token === undefined:
        return res.status(401).json({
          error: 'unauthorised to use this resource, please signup/login',
        });

      case token !== null:
        // eslint-disable-next-line no-case-declarations
        const decoded = verifyToken(token, process.env.JWT_LOGIN_SECRET);
        req.decoded = decoded;
        return next();

      default:
        break;
    }
  } catch (error) {
    return res.status(401).json({
      error: 'unauthorised to use this resource, please signup/login',
    });
  }
};
