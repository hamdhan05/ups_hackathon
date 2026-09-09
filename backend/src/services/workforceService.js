'use strict';

// Capacity per worker per day (workload units)
// This is a tunable operational constant.
const CAPACITY_PER_WORKER = {
  Receiving: 100,
  Putaway: 120,
  Picking: 80,
  Packing: 90,
  Shipping: 100,
  Inventory: 150,
};

const DEFAULT_CAPACITY_PER_WORKER = 100;

function getCapacityPerWorker(area) {
  return CAPACITY_PER_WORKER[area] || DEFAULT_CAPACITY_PER_WORKER;
}

/**
 * requiredWorkforce = ceil(forecastWorkload / capacityPerWorker)
 */
function calculateRequiredWorkforce(forecastWorkload, operationalArea) {
  const cpw = getCapacityPerWorker(operationalArea);
  return Math.ceil(forecastWorkload / cpw);
}

/**
 * capacityGap = availableWorkforce - requiredWorkforce
 * negative = shortage
 * zero = balanced
 * positive = excess
 */
function calculateCapacityGap(availableWorkforce, requiredWorkforce) {
  return availableWorkforce - requiredWorkforce;
}

/**
 * utilization = (workload / processingCapacity) * 100
 */
function calculateUtilization(workload, processingCapacity) {
  if (!processingCapacity || processingCapacity === 0) return 0;
  return Math.round((workload / processingCapacity) * 100);
}

function getCapacityStatus(capacityGap) {
  if (capacityGap < 0) return 'UNDER_CAPACITY';
  if (capacityGap === 0) return 'BALANCED';
  return 'OVER_CAPACITY';
}

function getUtilizationLabel(utilization) {
  if (utilization < 70) return 'UNDERUTILIZED';
  if (utilization <= 90) return 'NORMAL';
  if (utilization <= 100) return 'HIGH';
  return 'OVERUTILIZED';
}

function getRiskLevel(capacityGap, utilization) {
  if (utilization > 110 || capacityGap < -10) return 'CRITICAL';
  if (utilization > 100 || capacityGap < -5) return 'HIGH';
  if (utilization > 90 || capacityGap < 0) return 'MEDIUM';
  return 'LOW';
}

module.exports = {
  getCapacityPerWorker,
  calculateRequiredWorkforce,
  calculateCapacityGap,
  calculateUtilization,
  getCapacityStatus,
  getUtilizationLabel,
  getRiskLevel,
};
