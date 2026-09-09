'use strict';

const bottleneckService = require('../services/bottleneckService');
const { success, error } = require('../utils/response');

async function getBottlenecks(req, res, next) {
  try {
    const { startDate, endDate, operationType, operationalArea, severity, status } = req.query;
    const data = await bottleneckService.getBottlenecks({ startDate, endDate, operationType, operationalArea, severity, status });
    return success(res, data, 'Bottlenecks retrieved');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { getBottlenecks };
