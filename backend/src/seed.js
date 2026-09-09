'use strict';

/**
 * LogiPulse Seed Script
 * Generates 90 days of synthetic historical operations data
 * designed to produce the DEMO WOW MOMENT:
 *
 *   Shipping:   forecast=4200, required=42, available=35, gap=-7, util=120% → HIGH bottleneck
 *   Receiving:  forecast=1000, required=10, available=15, gap=+5, util=67% → excess
 *   Recommendation: Redistribute 5 workers from Receiving → Shipping
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { mongoUri } = require('./config/env');

const User = require('./models/User');
const Operation = require('./models/Operation');
const Forecast = require('./models/Forecast');
const Capacity = require('./models/Capacity');
const Bottleneck = require('./models/Bottleneck');
const Recommendation = require('./models/Recommendation');

// ─── Demo configuration ────────────────────────────────────────────────────────

const DEMO_EMAIL = 'manager@logipulse.demo';
const DEMO_PASSWORD = 'LogiPulse2026!';

/**
 * Area configuration:
 * baseWorkload — average daily workload units
 * trend        — daily growth rate (fraction)
 * available    — fixed available workforce
 * cpw          — capacity per worker (units/day)
 * operationType
 */
const AREA_CONFIG = {
  Receiving: {
    operationType: 'INBOUND',
    baseWorkload: 950,
    trend: 0.002,
    available: 15,
    cpw: 100,
  },
  Putaway: {
    operationType: 'INBOUND',
    baseWorkload: 800,
    trend: 0.002,
    available: 12,
    cpw: 120,
  },
  Picking: {
    operationType: 'OUTBOUND',
    baseWorkload: 1800,
    trend: 0.005,
    available: 25,
    cpw: 80,
  },
  Packing: {
    operationType: 'OUTBOUND',
    baseWorkload: 1500,
    trend: 0.005,
    available: 20,
    cpw: 90,
  },
  Shipping: {
    operationType: 'OUTBOUND',
    // Deliberately high and growing to hit 4200 at day 90
    baseWorkload: 3200,
    trend: 0.012,
    available: 35,
    cpw: 100,
  },
  Inventory: {
    operationType: 'INVENTORY',
    baseWorkload: 2000,
    trend: 0.001,
    available: 18,
    cpw: 150,
  },
};

const HISTORY_DAYS = 90;

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function jitter(value, pct = 0.08) {
  return Math.round(value * (1 + (Math.random() * 2 - 1) * pct));
}

// ─── Seed logic ────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected.');

  // Clear all collections
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Operation.deleteMany({}),
    Forecast.deleteMany({}),
    Capacity.deleteMany({}),
    Bottleneck.deleteMany({}),
    Recommendation.deleteMany({}),
  ]);
  console.log('Cleared.');

  // ─── User ──────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  await User.create({
    name: 'Logistics Manager',
    email: DEMO_EMAIL,
    passwordHash,
    role: 'LOGISTICS_MANAGER',
    isActive: true,
  });
  console.log(`Created user: ${DEMO_EMAIL}`);

  // ─── Historical Operations (90 days) ───────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = addDays(today, -HISTORY_DAYS);

  const operations = [];

  for (let day = 0; day < HISTORY_DAYS; day++) {
    const date = addDays(startDate, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (const [area, cfg] of Object.entries(AREA_CONFIG)) {
      // Compound growth
      const growthFactor = Math.pow(1 + cfg.trend, day);
      let baseToday = cfg.baseWorkload * growthFactor;

      // Weekend reduction
      if (isWeekend) baseToday *= 0.65;

      const workload = jitter(baseToday);
      const plannedWorkload = jitter(baseToday * 1.05);
      const completedWorkload = Math.round(workload * (isWeekend ? 0.95 : 0.92 + Math.random() * 0.1));

      const processingCapacity = cfg.available * cfg.cpw;
      const utilization = Math.round((workload / processingCapacity) * 100);
      const efficiency = Math.round((completedWorkload / plannedWorkload) * 100);

      const required = Math.ceil(workload / cfg.cpw);
      const gap = cfg.available - required;

      let status = 'NORMAL';
      if (gap < -5 || utilization > 110) status = 'AT_RISK';
      else if (utilization > 90) status = 'DELAYED';

      operations.push({
        date,
        operationType: cfg.operationType,
        operationalArea: area,
        workload,
        plannedWorkload,
        completedWorkload,
        processingCapacity,
        availableWorkforce: cfg.available,
        requiredWorkforce: required,
        processingTime: Math.round(8 + Math.random() * 4),
        delayRate: Math.max(0, Math.round((1 - efficiency / 100) * 100 * 0.3)),
        efficiency,
        utilization,
        status,
      });
    }
  }

  await Operation.insertMany(operations);
  console.log(`Inserted ${operations.length} operation records (${HISTORY_DAYS} days × ${Object.keys(AREA_CONFIG).length} areas)`);

  // ─── Forecasts (next 7 days) ────────────────────────────────────────────────
  const forecasts = [];

  for (let d = 1; d <= 7; d++) {
    const forecastDate = addDays(today, d);

    for (const [area, cfg] of Object.entries(AREA_CONFIG)) {
      // Forecast = recent trend extended by 7 more days
      const growthFactor = Math.pow(1 + cfg.trend, HISTORY_DAYS + d);
      let volume = Math.round(cfg.baseWorkload * growthFactor);

      // Pin Shipping to ~4200 on day 1 for demo
      if (area === 'Shipping' && d === 1) volume = 4200;

      const confidence = Math.min(95, 75 + Math.floor(HISTORY_DAYS / 10));

      forecasts.push({
        forecastDate,
        operationType: cfg.operationType,
        operationalArea: area,
        forecastedVolume: volume,
        modelName: 'MovingAverage',
        confidence,
        modelVersion: '1.0',
      });
    }
  }

  await Forecast.insertMany(forecasts);
  console.log(`Inserted ${forecasts.length} forecast records`);

  // ─── Capacity (today) ──────────────────────────────────────────────────────
  const capacityRecords = [];

  for (const [area, cfg] of Object.entries(AREA_CONFIG)) {
    // Use tomorrow's forecast (d=1)
    const forecastForArea = forecasts.find((f) => f.operationalArea === area);
    const forecastVolume = forecastForArea ? forecastForArea.forecastedVolume : cfg.baseWorkload;

    const required = Math.ceil(forecastVolume / cfg.cpw);
    const gap = cfg.available - required;
    const processingCapacity = cfg.available * cfg.cpw;
    const utilization = Math.round((forecastVolume / processingCapacity) * 100);

    let capStatus = 'BALANCED';
    if (gap < 0) capStatus = 'UNDER_CAPACITY';
    else if (gap > 0) capStatus = 'OVER_CAPACITY';

    let riskLevel = 'LOW';
    if (utilization > 130 || gap < -15) riskLevel = 'CRITICAL';
    else if (utilization > 110 || gap < -7) riskLevel = 'HIGH';
    else if (utilization > 100 || gap < 0) riskLevel = 'MEDIUM';

    capacityRecords.push({
      planningDate: today,
      operationType: cfg.operationType,
      operationalArea: area,
      forecastWorkload: forecastVolume,
      requiredWorkforce: required,
      availableWorkforce: cfg.available,
      capacityGap: gap,
      utilization,
      status: capStatus,
      riskLevel,
    });
  }

  const insertedCapacity = await Capacity.insertMany(capacityRecords);
  console.log(`Inserted ${insertedCapacity.length} capacity records`);
  console.log('\n── CAPACITY SUMMARY ──────────────────────');
  for (const c of capacityRecords) {
    console.log(
      `  ${c.operationalArea.padEnd(12)} | forecast=${String(c.forecastWorkload).padStart(5)} ` +
        `| req=${String(c.requiredWorkforce).padStart(3)} | avail=${String(c.availableWorkforce).padStart(3)} ` +
        `| gap=${String(c.capacityGap).padStart(4)} | util=${String(c.utilization).padStart(4)}% | ${c.status} | ${c.riskLevel}`
    );
  }

  // ─── Bottlenecks ────────────────────────────────────────────────────────────
  const bottlenecks = [];
  const capacityById = {};
  for (const c of insertedCapacity) {
    capacityById[c.operationalArea] = c._id;
  }

  for (const cap of capacityRecords) {
    const isShortage = cap.capacityGap < 0;
    const isOverutil = cap.utilization > 100;
    if (!isShortage && !isOverutil) continue;

    let severity = 'LOW';
    if (cap.utilization > 130 || cap.capacityGap < -15) severity = 'CRITICAL';
    else if (cap.utilization > 110 || cap.capacityGap < -7) severity = 'HIGH';
    else if (cap.utilization > 100 || cap.capacityGap < -3) severity = 'MEDIUM';

    const reasons = [];
    if (isShortage) reasons.push(`Workforce shortage: ${Math.abs(cap.capacityGap)} workers short`);
    if (isOverutil) reasons.push(`Utilization at ${cap.utilization}% (exceeds 100% capacity)`);

    bottlenecks.push({
      planningDate: today,
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

  const insertedBottlenecks = await Bottleneck.insertMany(bottlenecks);
  console.log(`\nInserted ${insertedBottlenecks.length} bottleneck records`);

  const bottleneckByArea = {};
  for (const b of insertedBottlenecks) {
    bottleneckByArea[b.operationalArea] = b._id;
  }

  // ─── Recommendations ────────────────────────────────────────────────────────
  const excessAreas = capacityRecords.filter((c) => c.capacityGap > 0);
  const shortageAreas = capacityRecords.filter((c) => c.capacityGap < 0);

  const recommendations = [];

  for (const target of shortageAreas) {
    const shortage = Math.abs(target.capacityGap);

    for (const source of excessAreas) {
      const excess = source.capacityGap;
      const recommended = Math.min(excess, shortage);
      if (recommended <= 0) continue;

      let priority = 'MEDIUM';
      if (target.riskLevel === 'CRITICAL') priority = 'CRITICAL';
      else if (target.riskLevel === 'HIGH') priority = 'HIGH';
      else if (target.riskLevel === 'LOW') priority = 'LOW';

      const reason =
        `${source.operationalArea} has ${excess} excess worker(s) (${source.utilization}% utilized). ` +
        `${target.operationalArea} has a shortage of ${shortage} worker(s) (${target.utilization}% utilized, ${Math.abs(target.capacityGap)} under capacity). ` +
        `Redistributing ${recommended} worker(s) will reduce the capacity gap.`;

      const expectedImpact =
        `After reallocation, ${target.operationalArea} utilization is projected to drop by ` +
        `approximately ${Math.round((recommended * source.cpw || 100) / (target.forecastWorkload / 100))}%, ` +
        `improving operational throughput and reducing risk.`;

      recommendations.push({
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
        bottleneckReference: bottleneckByArea[target.operationalArea] || undefined,
        capacityReference: capacityById[target.operationalArea] || undefined,
      });
    }
  }

  await Recommendation.insertMany(recommendations);
  console.log(`Inserted ${recommendations.length} recommendation records`);

  console.log('\n── RECOMMENDATIONS ─────────────────────────');
  for (const r of recommendations) {
    console.log(`  ${r.sourceArea} → ${r.targetArea}: ${r.recommendedResources} workers | ${r.priority}`);
  }

  console.log('\n✓ Seed complete!');
  console.log(`\nLogin credentials:\n  Email:    ${DEMO_EMAIL}\n  Password: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
