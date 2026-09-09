'use strict';

const operationsService = require('../services/operationsService');
const { success, error } = require('../utils/response');

async function getOperations(req, res, next) {
  try {
    const { startDate, endDate, operationType, operationalArea, status } = req.query;
    const data = await operationsService.getOperations({ startDate, endDate, operationType, operationalArea, status });
    return success(res, data, 'Operations retrieved');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { getOperations };
