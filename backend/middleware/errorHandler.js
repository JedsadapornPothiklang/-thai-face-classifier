const multer = require('multer');

/**
 * Global Express error handler.
 * Maps known error codes to appropriate HTTP status codes and clean JSON responses.
 */
function errorHandler(err, _req, res, _next) {
  console.error('[Error]', err.code || 'UNKNOWN', err.message);

  // Multer file size exceeded
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'FILE_TOO_LARGE',
      message: 'File size exceeds the 4 MB limit.',
    });
  }

  // Known application errors with an attached statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.code || 'APP_ERROR',
      message: err.message,
    });
  }

  // Unexpected errors — don't leak stack traces in production
  res.status(500).json({
    error: 'SERVER_ERROR',
    message: 'An unexpected error occurred. Please try again.',
  });
}

module.exports = errorHandler;
