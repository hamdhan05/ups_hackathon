'use strict';

const capacityService = require('../services/capacityService');
const { success, error } = require('../utils/response');

async function getCapacity(req, res, next) {
  try {
    const { startDate, endDate, operationType, operationalArea, status, riskLevel } = req.query;
    const data = await capacityService.getCapacity({ startDate, endDate, operationType, operationalArea, status, riskLevel });
    return success(res, data, 'Capacity data retrieved');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { getCapacity };
