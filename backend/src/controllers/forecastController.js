'use strict';

const forecastingService = require('../services/forecastingService');
const { success, error } = require('../utils/response');

async function getForecasts(req, res, next) {
  try {
    const { startDate, endDate, operationType, operationalArea } = req.query;
    const data = await forecastingService.getForecasts({ startDate, endDate, operationType, operationalArea });
    return success(res, data, 'Forecast retrieved');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { getForecasts };
