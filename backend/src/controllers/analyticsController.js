'use strict';

const analyticsService = require('../services/analyticsService');
const { success } = require('../utils/response');

async function getAnalytics(req, res, next) {
  try {
    const peakData = await analyticsService.getPeakAnalysis();
    const riskData = await analyticsService.getRiskAnalysis();
    const factorsData = analyticsService.getContributingFactors();

    return success(
      res,
      {
        peakAnalysis: peakData,
        riskAnalysis: riskData,
        contributingFactors: factorsData,
      },
      'Operational intelligence retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnalytics,
};
