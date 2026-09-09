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

      // Check if already exists and is ACCEPTED
      const existingRec = await Recommendation.findOne({
        recommendationDate: today,
        sourceArea: source.operationalArea,
        targetArea: target.operationalArea,
      });

      if (existingRec && (existingRec.status === 'ACCEPTED' || existingRec.status === 'COMPLETED')) {
        recommendations.push(existingRec);
        continue;
      }

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
          status: existingRec ? existingRec.status : 'PENDING',
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
  const rec = await Recommendation.findById(id);
  if (!rec) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Recommendation not found' };
  }

  const VALID = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
  if (!VALID.includes(status)) {
    throw { statusCode: 400, code: 'VALIDATION_ERROR', message: `Status must be one of: ${VALID.join(', ')}` };
  }

  if (status === 'ACCEPTED') {
    if (rec.status === 'ACCEPTED') {
      throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'This recommendation has already been accepted and executed.' };
    }

    const { sourceArea, targetArea, recommendedResources } = rec;
    const transferCount = Number(recommendedResources);

    if (!sourceArea || !targetArea || isNaN(transferCount) || transferCount <= 0) {
      throw { statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid recommendation details for resource transfer' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find capacity records for today (or latest available)
    let sourceCap = await Capacity.findOne({ planningDate: today, operationalArea: sourceArea });
    let targetCap = await Capacity.findOne({ planningDate: today, operationalArea: targetArea });

    if (!sourceCap) {
      sourceCap = await Capacity.findOne({ operationalArea: sourceArea }).sort({ planningDate: -1 });
    }
    if (!targetCap) {
      targetCap = await Capacity.findOne({ operationalArea: targetArea }).sort({ planningDate: -1 });
    }

    if (!sourceCap || !targetCap) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Capacity records for source or target area not found' };
    }

    // Safety validation: check source area has enough available workforce
    if (sourceCap.availableWorkforce < transferCount) {
      throw {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: `Cannot transfer ${transferCount} worker(s) from ${sourceArea}. Only ${sourceCap.availableWorkforce} worker(s) available.`,
      };
    }

    const {
      calculateCapacityGap,
      calculateUtilization,
      getCapacityStatus,
      getRiskLevel,
      getCapacityPerWorker,
    } = require('./workforceService');

    // Update Source Area Capacity
    const srcNewAvailable = sourceCap.availableWorkforce - transferCount;
    const srcCpw = getCapacityPerWorker(sourceArea);
    const srcNewGap = calculateCapacityGap(srcNewAvailable, sourceCap.requiredWorkforce);
    const srcNewUtil = calculateUtilization(sourceCap.forecastWorkload, srcNewAvailable * srcCpw);
    const srcNewStatus = getCapacityStatus(srcNewGap);
    const srcNewRisk = getRiskLevel(srcNewGap, srcNewUtil);

    sourceCap.availableWorkforce = srcNewAvailable;
    sourceCap.capacityGap = srcNewGap;
    sourceCap.utilization = srcNewUtil;
    sourceCap.status = srcNewStatus;
    sourceCap.riskLevel = srcNewRisk;

    // Update Target Area Capacity
    const tgtNewAvailable = targetCap.availableWorkforce + transferCount;
    const tgtCpw = getCapacityPerWorker(targetArea);
    const tgtNewGap = calculateCapacityGap(tgtNewAvailable, targetCap.requiredWorkforce);
    const tgtNewUtil = calculateUtilization(targetCap.forecastWorkload, tgtNewAvailable * tgtCpw);
    const tgtNewStatus = getCapacityStatus(tgtNewGap);
    const tgtNewRisk = getRiskLevel(tgtNewGap, tgtNewUtil);

    targetCap.availableWorkforce = tgtNewAvailable;
    targetCap.capacityGap = tgtNewGap;
    targetCap.utilization = tgtNewUtil;
    targetCap.status = tgtNewStatus;
    targetCap.riskLevel = tgtNewRisk;

    // Persist capacity updates
    await sourceCap.save();
    await targetCap.save();

    // Mark recommendation ACCEPTED
    rec.status = 'ACCEPTED';
    rec.appliedAt = new Date();
    await rec.save();

    // Re-evaluate & sync bottlenecks
    const { detectBottlenecks } = require('./bottleneckService');
    await syncBottlenecksAfterTransfer(today);

    return rec;
  } else {
    rec.status = status;
    await rec.save();
    return rec;
  }
}

/**
 * Re-evaluates open bottlenecks after workforce transfer.
 * Resolves bottlenecks if capacity deficit is cleared; updates severity/gap if shortage remains.
 */
async function syncBottlenecksAfterTransfer(todayDate) {
  const capacities = await Capacity.find({ planningDate: todayDate }).lean();

  for (const cap of capacities) {
    const isShortage = cap.capacityGap < 0;
    const isOverutilized = cap.utilization > 100;

    const existingBottleneck = await Bottleneck.findOne({
      planningDate: todayDate,
      operationalArea: cap.operationalArea,
    });

    if (!isShortage && !isOverutilized) {
      if (existingBottleneck && existingBottleneck.status === 'OPEN') {
        existingBottleneck.status = 'RESOLVED';
        existingBottleneck.availableWorkforce = cap.availableWorkforce;
        existingBottleneck.capacityGap = cap.capacityGap;
        existingBottleneck.utilization = cap.utilization;
        existingBottleneck.reason = `Workforce deficit resolved via recommendation reallocation.`;
        await existingBottleneck.save();
      }
    } else {
      let severity = 'LOW';
      if (cap.utilization > 130 || cap.capacityGap < -15) severity = 'CRITICAL';
      else if (cap.utilization > 110 || cap.capacityGap < -7) severity = 'HIGH';
      else if (cap.utilization > 100 || cap.capacityGap < -3) severity = 'MEDIUM';

      const reasons = [];
      if (isShortage) reasons.push(`Workforce shortage of ${Math.abs(cap.capacityGap)} workers`);
      if (isOverutilized) reasons.push(`Area is ${cap.utilization}% utilized (above 100%)`);

      if (existingBottleneck) {
        existingBottleneck.availableWorkforce = cap.availableWorkforce;
        existingBottleneck.capacityGap = cap.capacityGap;
        existingBottleneck.utilization = cap.utilization;
        existingBottleneck.severity = severity;
        existingBottleneck.reason = reasons.join('. ');
        await existingBottleneck.save();
      } else {
        await Bottleneck.create({
          planningDate: todayDate,
          operationType: cap.operationType,
          operationalArea: cap.operationalArea,
          workload: cap.forecastWorkload,
          availableWorkforce: cap.availableWorkforce,
          requiredWorkforce: cap.requiredWorkforce,
          capacityGap: cap.capacityGap,
          utilization: cap.utilization,
          severity,
          status: 'OPEN',
          reason: reasons.join('. '),
        });
      }
    }
  }
}

module.exports = { getRecommendations, generateRecommendations, updateRecommendationStatus };
