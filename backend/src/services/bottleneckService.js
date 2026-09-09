'use strict';

const Bottleneck = require('../models/Bottleneck');
const Capacity = require('../models/Capacity');

async function getBottlenecks({ startDate, endDate, operationType, operationalArea, severity, status } = {}) {
  const filter = {};

  if (startDate || endDate) {
    filter.planningDate = {};
    if (startDate) filter.planningDate.$gte = new Date(startDate);
    if (endDate) filter.planningDate.$lte = new Date(endDate);
  }

  if (operationType) filter.operationType = operationType;
  if (operationalArea) filter.operationalArea = operationalArea;
  if (severity) filter.severity = severity;
  if (status) filter.status = status;
  else filter.status = 'OPEN'; // default to open

  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const items = await Bottleneck.find(filter).sort({ planningDate: -1 }).lean();
  items.sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4));

  return { items };
}

/**
 * Detect bottlenecks from capacity data.
 * Triggers: capacityGap < 0 OR utilization > 100
 */
async function detectBottlenecks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const capacities = await Capacity.find({ planningDate: today }).lean();
  const bottlenecks = [];

  for (const cap of capacities) {
    const isShortage = cap.capacityGap < 0;
    const isOverutilized = cap.utilization > 100;

    const existingB = await Bottleneck.findOne({ planningDate: today, operationalArea: cap.operationalArea });

    if (!isShortage && !isOverutilized) {
      if (existingB && existingB.status === 'OPEN') {
        existingB.status = 'RESOLVED';
        existingB.availableWorkforce = cap.availableWorkforce;
        existingB.capacityGap = cap.capacityGap;
        existingB.utilization = cap.utilization;
        existingB.reason = 'Workforce deficit resolved via operational reallocation';
        await existingB.save();
      }
      continue;
    }

    let severity = 'LOW';
    if (cap.utilization > 130 || cap.capacityGap < -15) severity = 'CRITICAL';
    else if (cap.utilization > 110 || cap.capacityGap < -7) severity = 'HIGH';
    else if (cap.utilization > 100 || cap.capacityGap < -3) severity = 'MEDIUM';

    const reasons = [];
    if (isShortage) reasons.push(`Workforce shortage of ${Math.abs(cap.capacityGap)} workers`);
    if (isOverutilized) reasons.push(`Area is ${cap.utilization}% utilized (above 100%)`);
    const reason = reasons.join('. ');

    // Upsert bottleneck
    const b = await Bottleneck.findOneAndUpdate(
      { planningDate: today, operationalArea: cap.operationalArea, operationType: cap.operationType },
      {
        planningDate: today,
        operationType: cap.operationType,
        operationalArea: cap.operationalArea,
        workload: cap.forecastWorkload,
        availableWorkforce: cap.availableWorkforce,
        requiredWorkforce: cap.requiredWorkforce,
        capacityGap: cap.capacityGap,
        utilization: cap.utilization,
        severity,
        status: existingB && existingB.status === 'RESOLVED' ? 'RESOLVED' : 'OPEN',
        reason,
      },
      { upsert: true, new: true }
    );

    bottlenecks.push(b);
  }

  return bottlenecks;
}

module.exports = { getBottlenecks, detectBottlenecks };
