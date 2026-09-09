'use strict';

const recommendationService = require('../services/recommendationService');
const { success, error } = require('../utils/response');

async function getRecommendations(req, res, next) {
  try {
    const { startDate, endDate, status, priority, targetArea } = req.query;
    const data = await recommendationService.getRecommendations({ startDate, endDate, status, priority, targetArea });
    return success(res, data, 'Recommendations retrieved');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

async function updateRecommendation(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return error(res, 400, 'VALIDATION_ERROR', 'Status is required');
    }

    const rec = await recommendationService.updateRecommendationStatus(id, status);
    return success(res, rec, 'Recommendation updated');
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.statusCode, err.code, err.message);
    }
    next(err);
  }
}

module.exports = { getRecommendations, updateRecommendation };
