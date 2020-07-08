const errorHandler = (err, req, res, next) => {
  const error = { ...err, message: err.message };

  console.log('Error:'.red.bold, error);

  if (error.message === 'jwt expired') {
    error.statusCode = 401;
    error.message = 'please signup/login first!';
  }
  if (error.message === `Cannot read property 'startsWith' of undefined`) {
    error.statusCode = 401;
    error.message = 'make sure you provide a login token';
  }
  if (error.message === `jwt malformed`) {
    error.statusCode = 401;
    error.message = 'make sure you provide a valid login token';
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
  next();
};

export default errorHandler;
