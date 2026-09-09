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
 * Compute capacity records from latest forecasts.
 * Called during seeding and dashboard aggregation.
 */
async function computeCapacityFromForecasts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Get next-day forecasts
  const forecasts = await Forecast.find({
    forecastDate: { $gte: today, $lt: new Date(today.getTime() + 7 * 86400000) },
  }).lean();

  const areaMap = {};
  for (const f of forecasts) {
    const key = `${f.operationalArea}||${f.operationType}`;
    if (!areaMap[key]) {
      areaMap[key] = { area: f.operationalArea, type: f.operationType, volumes: [], refs: [] };
    }
    areaMap[key].volumes.push(f.forecastedVolume);
    areaMap[key].refs.push(f._id);
  }

  const results = [];

  for (const { area, type, volumes, refs } of Object.values(areaMap)) {
    const avgVolume = Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length);
    const available = AVAILABLE_WORKFORCE[area] || 10;
    const required = calculateRequiredWorkforce(avgVolume, area);
    const gap = calculateCapacityGap(available, required);
    const processingCapacity = available * 100;
    const util = calculateUtilization(avgVolume, processingCapacity);
    const capStatus = getCapacityStatus(gap);
    const risk = getRiskLevel(gap, util);

    // Upsert
    await Capacity.findOneAndUpdate(
      { planningDate: today, operationalArea: area, operationType: type },
      {
        planningDate: today,
        operationType: type,
        operationalArea: area,
        forecastWorkload: avgVolume,
        requiredWorkforce: required,
        availableWorkforce: available,
        capacityGap: gap,
        utilization: util,
        status: capStatus,
        riskLevel: risk,
        forecastReference: refs[0],
      },
      { upsert: true, new: true }
    );

    results.push({ area, type, gap, util, capStatus, risk });
  }

  return results;
}

module.exports = { getCapacity, computeCapacityFromForecasts };
