'use strict';

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { error } = require('../utils/response');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'UNAUTHORIZED', 'Authentication token required');
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'UNAUTHORIZED', 'Token expired');
    }
    return error(res, 401, 'UNAUTHORIZED', 'Invalid token');
  }
}

module.exports = authMiddleware;
