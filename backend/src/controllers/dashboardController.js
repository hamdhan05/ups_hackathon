'use strict';

const dashboardService = require('../services/dashboardService');
const { success, error } = require('../utils/response');

async function getDashboard(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const data = await dashboardService.getDashboard({ startDate, endDate });
    return success(res, data, 'Dashboard data retrieved');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { getDashboard };
