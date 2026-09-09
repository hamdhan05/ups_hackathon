'use strict';

const Capacity = require('../models/Capacity');
const Forecast = require('../models/Forecast');
const {
  calculateRequiredWorkforce,
  calculateCapacityGap,
  calculateUtilization,
  getCapacityStatus,
  getRiskLevel,
} = require('./workforceService');

// Fixed available workforce per area for demo (seeded)
const AVAILABLE_WORKFORCE = {
  Receiving: 15,
  Putaway: 12,
  Picking: 25,
  Packing: 20,
  Shipping: 35,
  Inventory: 18,
};

async function getCapacity({ startDate, endDate, operationType, operationalArea, status, riskLevel } = {}) {
  const filter = {};

  if (startDate || endDate) {
    filter.planningDate = {};
    if (startDate) filter.planningDate.$gte = new Date(startDate);
    if (endDate) filter.planningDate.$lte = new Date(endDate);
  }

  if (operationType) filter.operationType = operationType;
  if (operationalArea) filter.operationalArea = operationalArea;
  if (status) filter.status = status;
  if (riskLevel) filter.riskLevel = riskLevel;

  const items = await Capacity.find(filter).sort({ planningDate: -1, operationalArea: 1 }).lean();
  return { items };
}

/**
 * Compute capacity records from the nearest future forecast.
 * Skips if today's records already exist (e.g. seeded).
 * Uses per-area capacity-per-worker for accurate utilization.
 */
async function computeCapacityFromForecasts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Skip if today's capacity already seeded
  const existingCount = await Capacity.countDocuments({ planningDate: today });
  if (existingCount > 0) return [];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  // Use only the nearest forecast day
  const forecasts = await Forecast.find({
    forecastDate: { $gte: tomorrow, $lt: dayAfter },
  }).lean();

  const results = [];

  for (const f of forecasts) {
    const area = f.operationalArea;
    const type = f.operationType;
    const available = AVAILABLE_WORKFORCE[area] || 10;
    const required = calculateRequiredWorkforce(f.forecastedVolume, area);
    const gap = calculateCapacityGap(available, required);
    // Use the area's actual cpw for utilization
    const { getCapacityPerWorker } = require('./workforceService');
    const cpw = getCapacityPerWorker(area);
    const processingCapacity = available * cpw;
    const util = calculateUtilization(f.forecastedVolume, processingCapacity);
    const capStatus = getCapacityStatus(gap);
    const risk = getRiskLevel(gap, util);

    await Capacity.findOneAndUpdate(
      { planningDate: today, operationalArea: area, operationType: type },
      {
        planningDate: today,
        operationType: type,
        operationalArea: area,
        forecastWorkload: f.forecastedVolume,
        requiredWorkforce: required,
        availableWorkforce: available,
        capacityGap: gap,
        utilization: util,
        status: capStatus,
        riskLevel: risk,
        forecastReference: f._id,
      },
      { upsert: true, new: true }
    );

    results.push({ area, type, gap, util, capStatus, risk });
  }

  return results;
}


module.exports = { getCapacity, computeCapacityFromForecasts };
