'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

async function login(email, password) {
  // Sanitize
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
  }

  if (!user.isActive) {
    throw { statusCode: 403, code: 'FORBIDDEN', message: 'Account is inactive' };
  }

  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

  return { token, user: user.toSafeObject() };
}

module.exports = { login };
