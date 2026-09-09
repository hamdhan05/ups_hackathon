'use strict';

function success(res, data, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message });
}

function error(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

module.exports = { success, error };
