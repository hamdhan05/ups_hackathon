'use strict';

function errorHandler(err, req, res, next) {
  console.error('Unhandled error details:', err.stack || err);

  if (err.name === 'MongooseServerSelectionError' || err.message?.includes('buffering timed out')) {
    return res.status(503).json({
      success: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'Database connection is initializing or unavailable. Please retry in a few seconds.' },
    });
  }

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
    error: { code: 'INTERNAL_ERROR', message: err.message || 'An internal error occurred' },
  });
}

module.exports = errorHandler;
