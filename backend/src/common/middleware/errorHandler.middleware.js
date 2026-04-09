

const errorHandler = (err, req, res, next) => {
  
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      body: req.body,
      params: req.params,
    });
  }

  
  if (err.isValidation) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors: err.errors || [err.message],
    });
  }

  
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
    });
  }

  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token. Please login again.',
      code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Token expired. Please login again.',
      code: 'TOKEN_EXPIRED',
    });
  }

  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid ID format',
      code: 'INVALID_ID',
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation error',
      errors: messages,
      code: 'VALIDATION_ERROR',
    });
  }

  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: `${field} already exists`,
      code: 'DUPLICATE_ENTRY',
      field,
    });
  }

  
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
