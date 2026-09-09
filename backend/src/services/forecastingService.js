'use strict';

const Operation = require('../models/Operation');
const Forecast = require('../models/Forecast');

const FORECAST_HORIZON_DAYS = 7;
const MIN_HISTORY_DAYS = 7;
const MOVING_AVG_WINDOW = 7;

/**
 * Simple weighted moving average forecasting.
 * More recent values get higher weights.
 */
function weightedMovingAverage(values) {
  if (!values || values.length === 0) return 0;
  const window = values.slice(-MOVING_AVG_WINDOW);
  const n = window.length;
  let weightedSum = 0;
  let weightTotal = 0;
  for (let i = 0; i < n; i++) {
    const weight = i + 1; // 1..n
    weightedSum += window[i] * weight;
    weightTotal += weight;
  }
  return Math.round(weightedSum / weightTotal);
}

async function generateForecasts(operationType, operationalArea) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 90);

  const filter = { date: { $gte: sinceDate } };
  if (operationType) filter.operationType = operationType;
  if (operationalArea) filter.operationalArea = operationalArea;

  const ops = await Operation.find(filter).sort({ date: 1 }).lean();

  if (ops.length < MIN_HISTORY_DAYS) {
    throw { statusCode: 503, code: 'FORECAST_UNAVAILABLE', message: 'Insufficient historical data for forecast' };
  }

  // Group by operationType+area combo
  const groups = {};
  for (const op of ops) {
    const key = `${op.operationType}||${op.operationalArea}`;
    if (!groups[key]) groups[key] = { workloads: [], type: op.operationType, area: op.operationalArea };
    groups[key].workloads.push(op.workload);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const forecasts = [];

  for (const { workloads, type, area } of Object.values(groups)) {
    const baseVolume = weightedMovingAverage(workloads);
    const confidence = Math.min(95, 60 + Math.floor(workloads.length / 3));

    for (let d = 1; d <= FORECAST_HORIZON_DAYS; d++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + d);

      // Check existing
      const existing = await Forecast.findOne({
        forecastDate: { $gte: forecastDate, $lt: new Date(forecastDate.getTime() + 86400000) },
        operationType: type,
        operationalArea: area,
      });

      if (existing) {
        forecasts.push(existing);
        continue;
      }

      // Slight variation per day (deterministic)
      const multiplier = 1 + ((d % 3) - 1) * 0.05;
      const volume = Math.round(baseVolume * multiplier);

      const f = await Forecast.create({
        forecastDate,
        operationType: type,
        operationalArea: area,
        forecastedVolume: volume,
        modelName: 'MovingAverage',
        confidence,
        modelVersion: '1.0',
      });
      forecasts.push(f);
    }
  }

  return forecasts;
}

async function getForecasts({ startDate, endDate, operationType, operationalArea } = {}) {
  const filter = {};

  if (startDate || endDate) {
    filter.forecastDate = {};
    if (startDate) filter.forecastDate.$gte = new Date(startDate);
    if (endDate) filter.forecastDate.$lte = new Date(endDate);
  }

  if (operationType) filter.operationType = operationType;
  if (operationalArea) filter.operationalArea = operationalArea;

  // If no forecast records exist, generate them
  const count = await Forecast.countDocuments(filter);
  if (count === 0) {
    try {
      await generateForecasts(operationType, operationalArea);
    } catch (e) {
      if (e.code === 'FORECAST_UNAVAILABLE') throw e;
    }
  }

  const items = await Forecast.find(filter).sort({ forecastDate: 1, operationalArea: 1 }).lean();
  return { items };
}

module.exports = { getForecasts, generateForecasts };
