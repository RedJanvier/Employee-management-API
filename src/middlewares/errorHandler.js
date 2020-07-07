const errorHandler = (err, req, res, next) => {
  const error = { ...err, message: err.message };

  console.log(`Error: ${error}`, error);

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
  next();
};

export default errorHandler;
