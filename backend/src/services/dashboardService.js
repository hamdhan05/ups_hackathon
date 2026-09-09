'use strict';

const Operation = require('../models/Operation');
const Forecast = require('../models/Forecast');
const Capacity = require('../models/Capacity');
const Bottleneck = require('../models/Bottleneck');
const Recommendation = require('../models/Recommendation');
const { getTrends } = require('./operationsService');
const { computeCapacityFromForecasts } = require('./capacityService');
const { detectBottlenecks } = require('./bottleneckService');
const { generateRecommendations } = require('./recommendationService');

async function getDashboard({ startDate, endDate } = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Date range for summary (default last 30 days)
  const rangeStart = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 86400000);
  const rangeEnd = endDate ? new Date(endDate) : today;

  // Refresh capacity/bottlenecks/recommendations
  await computeCapacityFromForecasts();
  await detectBottlenecks();
  await generateRecommendations();

  // Summary aggregation
  const [inboundAgg, outboundAgg, inventoryAgg] = await Promise.all([
    Operation.aggregate([
      { $match: { date: { $gte: rangeStart, $lte: rangeEnd }, operationType: 'INBOUND' } },
      { $group: { _id: null, total: { $sum: '$workload' }, avgEff: { $avg: '$efficiency' }, avgUtil: { $avg: '$utilization' } } },
    ]),
    Operation.aggregate([
      { $match: { date: { $gte: rangeStart, $lte: rangeEnd }, operationType: 'OUTBOUND' } },
      { $group: { _id: null, total: { $sum: '$workload' }, avgEff: { $avg: '$efficiency' }, avgUtil: { $avg: '$utilization' } } },
    ]),
    Operation.aggregate([
      { $match: { date: { $gte: rangeStart, $lte: rangeEnd }, operationType: 'INVENTORY' } },
      { $group: { _id: null, total: { $sum: '$workload' }, avgEff: { $avg: '$efficiency' }, avgUtil: { $avg: '$utilization' } } },
    ]),
  ]);

  const todayCapacity = await Capacity.find({ planningDate: today }).lean();
  const totalRequired = todayCapacity.reduce((s, c) => s + c.requiredWorkforce, 0);
  const totalAvailable = todayCapacity.reduce((s, c) => s + c.availableWorkforce, 0);
  const totalGap = totalAvailable - totalRequired;
  const avgUtil = todayCapacity.length
    ? Math.round(todayCapacity.reduce((s, c) => s + c.utilization, 0) / todayCapacity.length)
    : 0;

  const allEff = [
    ...(inboundAgg[0]?.avgEff ? [inboundAgg[0].avgEff] : []),
    ...(outboundAgg[0]?.avgEff ? [outboundAgg[0].avgEff] : []),
    ...(inventoryAgg[0]?.avgEff ? [inventoryAgg[0].avgEff] : []),
  ];
  const avgEfficiency = allEff.length ? Math.round(allEff.reduce((a, b) => a + b, 0) / allEff.length) : 0;

  const [activeBottlenecks, pendingRecommendations] = await Promise.all([
    Bottleneck.countDocuments({ status: 'OPEN' }),
    Recommendation.countDocuments({ status: 'PENDING' }),
  ]);

  const summary = {
    inboundWorkload: inboundAgg[0]?.total || 0,
    outboundWorkload: outboundAgg[0]?.total || 0,
    inventoryVolume: inventoryAgg[0]?.total || 0,
    requiredWorkforce: totalRequired,
    availableWorkforce: totalAvailable,
    capacityGap: totalGap,
    averageEfficiency: avgEfficiency,
    averageUtilization: avgUtil,
    activeBottlenecks,
    pendingRecommendations,
  };

  // Trends (30 days)
  const trends = await getTrends(30);

  // Forecasts (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const forecasts = await Forecast.find({ forecastDate: { $gte: today, $lte: nextWeek } })
    .sort({ forecastDate: 1 })
    .lean();

  // Capacity
  const capacity = await Capacity.find({ planningDate: today }).sort({ operationalArea: 1 }).lean();

  // Bottlenecks
  const bottlenecks = await Bottleneck.find({ status: 'OPEN' })
    .sort({ severity: 1 })
    .limit(10)
    .lean();

  // Recommendations
  const recommendations = await Recommendation.find({ status: { $in: ['PENDING', 'ACCEPTED'] } })
    .sort({ priority: -1 })
    .limit(10)
    .lean();

  return { summary, trends, forecasts, capacity, bottlenecks, recommendations };
}

module.exports = { getDashboard };
