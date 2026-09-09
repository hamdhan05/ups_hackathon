'use strict';

function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.message },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid ID format' },
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_RESOURCE', message: 'Resource already exists' },
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An internal error occurred' },
  });
}

module.exports = errorHandler;
