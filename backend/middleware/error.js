const errorHandler = (err, req, res, next) => {
  // Log error for dev
  console.log(err.stack);

  let statusCode = 500;
  let message = 'Server Error';

  // bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found`;
    statusCode = 404;
  }

  // duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;