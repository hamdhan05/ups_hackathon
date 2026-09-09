'use strict';

const Operation = require('../models/Operation');

const VALID_TYPES = ['INBOUND', 'OUTBOUND', 'INVENTORY'];
const VALID_AREAS = ['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory'];
const VALID_STATUSES = ['NORMAL', 'DELAYED', 'AT_RISK', 'COMPLETED'];

async function getOperations({ startDate, endDate, operationType, operationalArea, status } = {}) {
  const filter = {};

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (operationType && VALID_TYPES.includes(operationType)) {
    filter.operationType = operationType;
  }

  if (operationalArea && VALID_AREAS.includes(operationalArea)) {
    filter.operationalArea = operationalArea;
  }

  if (status && VALID_STATUSES.includes(status)) {
    filter.status = status;
  }

  const items = await Operation.find(filter).sort({ date: -1 }).limit(500).lean();
  return { items, count: items.length };
}

async function getTrends(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const pipeline = [
    { $match: { date: { $gte: since } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          operationType: '$operationType',
        },
        totalWorkload: { $sum: '$workload' },
        avgEfficiency: { $avg: '$efficiency' },
        avgUtilization: { $avg: '$utilization' },
      },
    },
    { $sort: { '_id.date': 1 } },
  ];

  const raw = await Operation.aggregate(pipeline);

  const inbound = [];
  const outbound = [];
  const inventory = [];
  const efficiency = [];
  const utilization = [];

  const effMap = {};
  const utilMap = {};

  for (const row of raw) {
    const point = { date: row._id.date, value: row.totalWorkload };
    if (row._id.operationType === 'INBOUND') inbound.push(point);
    else if (row._id.operationType === 'OUTBOUND') outbound.push(point);
    else if (row._id.operationType === 'INVENTORY') inventory.push(point);

    if (!effMap[row._id.date]) {
      effMap[row._id.date] = { sum: 0, count: 0 };
      utilMap[row._id.date] = { sum: 0, count: 0 };
    }
    if (row.avgEfficiency != null) {
      effMap[row._id.date].sum += row.avgEfficiency;
      effMap[row._id.date].count += 1;
    }
    if (row.avgUtilization != null) {
      utilMap[row._id.date].sum += row.avgUtilization;
      utilMap[row._id.date].count += 1;
    }
  }

  for (const [date, v] of Object.entries(effMap)) {
    efficiency.push({ date, value: v.count ? Math.round(v.sum / v.count) : 0 });
    utilization.push({ date, value: utilMap[date].count ? Math.round(utilMap[date].sum / utilMap[date].count) : 0 });
  }
  efficiency.sort((a, b) => a.date.localeCompare(b.date));
  utilization.sort((a, b) => a.date.localeCompare(b.date));

  return { inbound, outbound, inventory, efficiency, utilization };
}

module.exports = { getOperations, getTrends };
