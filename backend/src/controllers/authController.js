'use strict';

const authService = require('../services/authService');
const { success, error } = require('../utils/response');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, 'VALIDATION_ERROR', 'Email and password are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error(res, 400, 'VALIDATION_ERROR', 'Invalid email format');
    }

    const result = await authService.login(email, password);
    return success(res, result, 'Login successful');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { login };
