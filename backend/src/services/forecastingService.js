'use strict';

const Operation = require('../models/Operation');
const Forecast = require('../models/Forecast');

const FORECAST_HORIZON_DAYS = 7;
const MIN_HISTORY_DAYS = 14;

/**
 * Solves A * beta = b using Gaussian Elimination with partial pivoting.
 * A is K x K, b is K x 1 vector.
 */
function solveLinearSystem(A, b) {
  const n = A.length;

  // Augment A with b -> [A | b]
  const M = new Array(n);
  for (let i = 0; i < n; i++) {
    M[i] = new Array(n + 1);
    for (let j = 0; j < n; j++) {
      M[i][j] = A[i][j];
    }
    M[i][n] = b[i];
  }

  // Forward elimination
  for (let p = 0; p < n; p++) {
    // Find pivot row
    let maxRow = p;
    for (let i = p + 1; i < n; i++) {
      if (Math.abs(M[i][p]) > Math.abs(M[maxRow][p])) {
        maxRow = i;
      }
    }

    // Swap pivot row
    const temp = M[p];
    M[p] = M[maxRow];
    M[maxRow] = temp;

    // Check singularity
    if (Math.abs(M[p][p]) < 1e-12) {
      continue; // Skip near-zero pivot
    }

    // Pivot normalization and elimination
    for (let i = p + 1; i < n; i++) {
      const alpha = M[i][p] / M[p][p];
      for (let j = p; j <= n; j++) {
        M[i][j] -= alpha * M[p][j];
      }
    }
  }

  // Back substitution
  const beta = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * beta[j];
    }
    if (Math.abs(M[i][i]) > 1e-12) {
      beta[i] = sum / M[i][i];
    } else {
      beta[i] = 0;
    }
  }

  return beta;
}

/**
 * Fits Ordinary Least Squares (OLS) Linear Regression with Ridge Regularization.
 * beta = (X^T * X + lambda * I)^(-1) * X^T * y
 */
function fitLinearRegression(X, y, ridgeLambda = 1e-4) {
  const numSamples = X.length;
  const numFeatures = X[0].length;

  // A = X^T * X (numFeatures x numFeatures)
  const A = Array.from({ length: numFeatures }, () => new Array(numFeatures).fill(0));
  for (let i = 0; i < numFeatures; i++) {
    for (let j = 0; j < numFeatures; j++) {
      let sum = 0;
      for (let r = 0; r < numSamples; r++) {
        sum += X[r][i] * X[r][j];
      }
      A[i][j] = sum;
    }
    // Add ridge penalty for numerical stability
    A[i][i] += ridgeLambda;
  }

  // b = X^T * y (numFeatures x 1)
  const b = new Array(numFeatures).fill(0);
  for (let i = 0; i < numFeatures; i++) {
    let sum = 0;
    for (let r = 0; r < numSamples; r++) {
      sum += X[r][i] * y[r];
    }
    b[i] = sum;
  }

  // Solve A * beta = b
  return solveLinearSystem(A, b);
}

/**
 * Extract feature vector for a given day in the historical/future timeline.
 * Features:
 * 0: Intercept (1.0)
 * 1: dayIndex (0, 1, 2, ...)
 * 2..7: One-hot encoded dayOfWeek (isMon, isTue, isWed, isThu, isFri, isSat)
 * 8: rolling7 (7-day rolling average)
 * 9: rolling14 (14-day rolling average)
 * 10: previousDayWorkload
 * 11: previous7DayAverage
 * 12: recentTrend (% change between rolling7 and previous7DayAverage)
 */
function extractFeatures(workloads, dates, index) {
  const dayIndex = index;
  const dateObj = new Date(dates[index]);
  const dayOfWeek = dateObj.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Day of week dummy variables (Sun is baseline 0,0,0,0,0,0)
  const isMon = dayOfWeek === 1 ? 1 : 0;
  const isTue = dayOfWeek === 2 ? 1 : 0;
  const isWed = dayOfWeek === 3 ? 1 : 0;
  const isThu = dayOfWeek === 4 ? 1 : 0;
  const isFri = dayOfWeek === 5 ? 1 : 0;
  const isSat = dayOfWeek === 6 ? 1 : 0;

  // Compute lag features strictly from prior workloads (< index) to avoid data leakage
  const prior = workloads.slice(0, index);

  let rolling7 = 0;
  if (prior.length > 0) {
    const slice7 = prior.slice(-7);
    rolling7 = slice7.reduce((a, b) => a + b, 0) / slice7.length;
  } else {
    rolling7 = workloads[index] || 0;
  }

  let rolling14 = 0;
  if (prior.length > 0) {
    const slice14 = prior.slice(-14);
    rolling14 = slice14.reduce((a, b) => a + b, 0) / slice14.length;
  } else {
    rolling14 = rolling7;
  }

  const previousDayWorkload = prior.length > 0 ? prior[prior.length - 1] : workloads[index] || 0;

  let previous7DayAverage = rolling7;
  if (prior.length >= 14) {
    const prev7Slice = prior.slice(-14, -7);
    previous7DayAverage = prev7Slice.reduce((a, b) => a + b, 0) / prev7Slice.length;
  }

  const recentTrend = (rolling7 - previous7DayAverage) / (previous7DayAverage + 1e-5);

  return [
    1.0, // Intercept
    dayIndex,
    isMon,
    isTue,
    isWed,
    isThu,
    isFri,
    isSat,
    rolling7,
    rolling14,
    previousDayWorkload,
    previous7DayAverage,
    recentTrend,
  ];
}

/**
 * Predict volume for a feature vector using linear regression coefficients
 */
function predictVolume(featureVector, beta) {
  let val = 0;
  for (let j = 0; j < featureVector.length; j++) {
    const weight = beta[j] || 0;
    val += featureVector[j] * weight;
  }
  // Safety checks: finite, non-NaN, non-negative
  if (!isFinite(val) || isNaN(val)) {
    val = featureVector[8] || 0; // fallback to rolling7
  }
  return Math.max(0, Math.round(val));
}

/**
 * Perform Chronological Backtesting & Accuracy Metric Calculation
 */
function performBacktesting(workloads, dates) {
  const total = workloads.length;
  if (total < MIN_HISTORY_DAYS) {
    return { mae: 0, mape: 0, confidence: 75 };
  }

  // 80% train, 20% validation split (chronological)
  const trainSize = Math.floor(total * 0.8);
  const valSize = total - trainSize;

  // Build training feature matrix
  const X_train = [];
  const y_train = [];
  for (let i = 0; i < trainSize; i++) {
    X_train.push(extractFeatures(workloads, dates, i));
    y_train.push(workloads[i]);
  }

  // Train model on training set
  const beta = fitLinearRegression(X_train, y_train);

  // Validate on remaining validation set
  let totalAbsError = 0;
  let totalPctError = 0;

  for (let i = trainSize; i < total; i++) {
    const feat = extractFeatures(workloads, dates, i);
    const pred = predictVolume(feat, beta);
    const actual = workloads[i];

    const absErr = Math.abs(actual - pred);
    totalAbsError += absErr;

    const safeActual = Math.max(Math.abs(actual), 1e-5);
    const pctErr = (absErr / safeActual) * 100;
    totalPctError += pctErr;
  }

  const mae = Math.round((totalAbsError / valSize) * 100) / 100;
  const mape = Math.round((totalPctError / valSize) * 100) / 100;

  // Derive model quality / confidence from validation MAPE
  const confidence = Math.max(50, Math.min(98, Math.round(100 - mape)));

  return { mae, mape, confidence };
}

/**
 * Calculate historical trend direction and percentage change
 */
function calculateTrend(workloads) {
  if (!workloads || workloads.length < 14) {
    return { trendDirection: 'STABLE', trendPercentage: 0 };
  }

  const recent7 = workloads.slice(-7);
  const previous7 = workloads.slice(-14, -7);

  const recentAvg = recent7.reduce((a, b) => a + b, 0) / 7;
  const prevAvg = previous7.reduce((a, b) => a + b, 0) / 7;

  const pctChange = ((recentAvg - prevAvg) / Math.max(prevAvg, 1)) * 100;
  const trendPercentage = Math.round(pctChange * 100) / 100;

  let trendDirection = 'STABLE';
  if (trendPercentage > 2.0) trendDirection = 'INCREASING';
  else if (trendPercentage < -2.0) trendDirection = 'DECREASING';

  return { trendDirection, trendPercentage };
}

/**
 * Generate 7-Day Linear Regression Forecasts for all operational areas
 */
async function generateForecasts(operationType, operationalArea) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 120);

  const filter = { date: { $gte: sinceDate } };
  if (operationType) filter.operationType = operationType;
  if (operationalArea) filter.operationalArea = operationalArea;

  const ops = await Operation.find(filter).sort({ date: 1 }).lean();

  if (ops.length < MIN_HISTORY_DAYS) {
    throw { statusCode: 503, code: 'FORECAST_UNAVAILABLE', message: 'Insufficient historical data for Linear Regression forecast' };
  }

  // Group by operationType+area combo
  const groups = {};
  for (const op of ops) {
    const key = `${op.operationType}||${op.operationalArea}`;
    if (!groups[key]) {
      groups[key] = {
        workloads: [],
        dates: [],
        type: op.operationType,
        area: op.operationalArea,
      };
    }
    groups[key].workloads.push(op.workload);
    groups[key].dates.push(new Date(op.date));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const forecasts = [];

  for (const { workloads, dates, type, area } of Object.values(groups)) {
    // 1. Perform chronological backtesting
    const { mae, mape, confidence } = performBacktesting(workloads, dates);

    // 2. Calculate trend
    const { trendDirection, trendPercentage } = calculateTrend(workloads);

    // 3. Train full Linear Regression model on all historical records
    const X_full = [];
    const y_full = [];
    for (let i = 0; i < workloads.length; i++) {
      X_full.push(extractFeatures(workloads, dates, i));
      y_full.push(workloads[i]);
    }
    const beta = fitLinearRegression(X_full, y_full);

    // 4. Generate 7-day future predictions autoregressively
    const forecastWorkloads = [...workloads];
    const forecastDates = [...dates];
    const baseIdx = workloads.length;

    for (let d = 1; d <= FORECAST_HORIZON_DAYS; d++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + d);

      const targetIdx = baseIdx + d - 1;
      forecastDates.push(forecastDate);

      // Extract feature vector for future day
      const feat = extractFeatures(forecastWorkloads, forecastDates, targetIdx);

      // Predict volume via Linear Regression
      const volume = predictVolume(feat, beta);

      // Append predicted volume to rolling workload buffer for subsequent future days
      forecastWorkloads.push(volume);

      // Upsert into MongoDB Forecast collection
      const f = await Forecast.findOneAndUpdate(
        {
          forecastDate: {
            $gte: forecastDate,
            $lt: new Date(forecastDate.getTime() + 86400000),
          },
          operationType: type,
          operationalArea: area,
        },
        {
          forecastDate,
          operationType: type,
          operationalArea: area,
          forecastedVolume: volume,
          modelName: 'LinearRegression',
          confidence,
          validationMAE: mae,
          validationMAPE: mape,
          trendDirection,
          trendPercentage,
          modelVersion: '2.0',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

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

  // Always generate/refresh Linear Regression forecasts if missing or on demand
  const count = await Forecast.countDocuments({ ...filter, modelName: 'LinearRegression' });
  if (count === 0) {
    try {
      await generateForecasts(operationType, operationalArea);
    } catch (e) {
      if (e.code === 'FORECAST_UNAVAILABLE') throw e;
    }
  }

  const items = await Forecast.find(filter).sort({ forecastDate: 1, operationalArea: 1 }).lean();

  // Extract per-area validation metrics
  const metrics = {};
  for (const item of items) {
    if (!metrics[item.operationalArea]) {
      metrics[item.operationalArea] = {
        modelName: item.modelName,
        confidence: item.confidence,
        validationMAE: item.validationMAE,
        validationMAPE: item.validationMAPE,
        trendDirection: item.trendDirection,
        trendPercentage: item.trendPercentage,
      };
    }
  }

  return { items, metrics };
}

module.exports = { getForecasts, generateForecasts, performBacktesting, fitLinearRegression };
