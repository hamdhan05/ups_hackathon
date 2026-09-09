'use strict';

const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation');
const Capacity = require('../models/Capacity');
const Bottleneck = require('../models/Bottleneck');

async function getRecommendations({ startDate, endDate, status, priority, targetArea } = {}) {
  const filter = {};

  if (startDate || endDate) {
    filter.recommendationDate = {};
    if (startDate) filter.recommendationDate.$gte = new Date(startDate);
    if (endDate) filter.recommendationDate.$lte = new Date(endDate);
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (targetArea) filter.targetArea = targetArea;

  const items = await Recommendation.find(filter)
    .sort({ status: 1, priority: -1, recommendationDate: -1 })
    .lean();

  return { items };
}

/**
 * Generate recommendations by matching excess areas with shortage areas.
 * recommendedResources = min(sourceExcess, targetShortage)
 */
async function generateRecommendations() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const capacities = await Capacity.find({ planningDate: today }).lean();

  const sources = capacities.filter((c) => c.capacityGap > 0);
  const targets = capacities.filter((c) => c.capacityGap < 0);
  const openBottlenecks = await Bottleneck.find({ planningDate: today, status: 'OPEN' }).lean();
  const bottleneckMap = {};
  for (const b of openBottlenecks) {
    bottleneckMap[b.operationalArea] = b._id;
  }

  const capacityMap = {};
  for (const c of capacities) {
    capacityMap[c.operationalArea] = c._id;
  }

  const recommendations = [];

  for (const target of targets) {
    const shortage = Math.abs(target.capacityGap);

    for (const source of sources) {
      const excess = source.capacityGap;
      const recommended = Math.min(excess, shortage);

      if (recommended <= 0) continue;

      let priority = 'MEDIUM';
      if (target.riskLevel === 'CRITICAL' || target.utilization > 130) priority = 'CRITICAL';
      else if (target.riskLevel === 'HIGH' || target.utilization > 110) priority = 'HIGH';
      else if (target.riskLevel === 'LOW') priority = 'LOW';

      const reason =
        `${source.operationalArea} has ${excess} excess workforce capacity while ` +
        `${target.operationalArea} faces a shortage of ${shortage} workers ` +
        `(${target.utilization}% utilization). ` +
        `Redistributing ${recommended} worker(s) will reduce the gap.`;

      const expectedImpact =
        `Projected utilization in ${target.operationalArea} will drop from ` +
        `${target.utilization}% toward target range after reallocation.`;

      // Upsert: one recommendation per source→target pair per day
      const rec = await Recommendation.findOneAndUpdate(
        {
          recommendationDate: today,
          sourceArea: source.operationalArea,
          targetArea: target.operationalArea,
        },
        {
          recommendationDate: today,
          sourceArea: source.operationalArea,
          targetArea: target.operationalArea,
          operationType: target.operationType,
          recommendedResources: recommended,
          sourceAvailableCapacity: excess,
          targetCapacityGap: target.capacityGap,
          reason,
          priority,
          expectedImpact,
          status: 'PENDING',
          bottleneckReference: bottleneckMap[target.operationalArea] || undefined,
          capacityReference: capacityMap[target.operationalArea] || undefined,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      recommendations.push(rec);
    }
  }

  return recommendations;
}

async function updateRecommendationStatus(id, status) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid recommendation ID' };
  }

  const VALID = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
  if (!VALID.includes(status)) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: `Status must be one of: ${VALID.join(', ')}` };
  }

  const rec = await Recommendation.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!rec) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Recommendation not found' };
  }

  return rec;
}

module.exports = { getRecommendations, generateRecommendations, updateRecommendationStatus };
