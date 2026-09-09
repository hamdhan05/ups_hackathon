'use strict';

const Operation = require('../models/Operation');
const Capacity = require('../models/Capacity');
const Bottleneck = require('../models/Bottleneck');

/**
 * Perform Peak vs Non-Peak Operational Analysis
 */
async function getPeakAnalysis() {
  const operations = await Operation.find({}).lean();
  if (!operations || operations.length === 0) {
    return { peakDays: [], nonPeakDays: [], summary: {} };
  }

  // Group operations by date string YYYY-MM-DD
  const daysMap = {};

  for (const op of operations) {
    const dateStr = new Date(op.date).toISOString().split('T')[0];
    if (!daysMap[dateStr]) {
      daysMap[dateStr] = {
        date: dateStr,
        totalWorkload: 0,
        completedWorkload: 0,
        plannedWorkload: 0,
        areas: {},
      };
    }
    daysMap[dateStr].totalWorkload += op.workload || 0;
    daysMap[dateStr].completedWorkload += op.completedWorkload || 0;
    daysMap[dateStr].plannedWorkload += op.plannedWorkload || 0;

    if (!daysMap[dateStr].areas[op.operationalArea]) {
      daysMap[dateStr].areas[op.operationalArea] = {
        workload: 0,
        efficiency: 0,
        utilization: 0,
        count: 0,
      };
    }
    const a = daysMap[dateStr].areas[op.operationalArea];
    a.workload += op.workload || 0;
    a.efficiency += op.efficiency || 0;
    a.utilization += op.utilization || 0;
    a.count += 1;
  }

  const daysList = Object.values(daysMap);
  const totalDays = daysList.length;

  const totalVolumeSum = daysList.reduce((acc, d) => acc + d.totalWorkload, 0);
  const avgDailyWorkload = totalDays > 0 ? totalVolumeSum / totalDays : 0;

  // Threshold: Day workload > 1.15 * avgDailyWorkload is a PEAK day
  const peakThreshold = avgDailyWorkload * 1.15;

  const peakDays = [];
  const nonPeakDays = [];

  for (const d of daysList) {
    const eff = d.plannedWorkload > 0 ? Math.round((d.completedWorkload / d.plannedWorkload) * 100) : 90;
    const item = {
      date: d.date,
      totalWorkload: d.totalWorkload,
      efficiency: eff,
      isPeak: d.totalWorkload >= peakThreshold,
    };
    if (item.isPeak) {
      peakDays.push(item);
    } else {
      nonPeakDays.push(item);
    }
  }

  // Calculate averages
  const calcAvg = (arr) => {
    if (arr.length === 0) return { avgWorkload: 0, avgEfficiency: 0 };
    const wSum = arr.reduce((acc, x) => acc + x.totalWorkload, 0);
    const eSum = arr.reduce((acc, x) => acc + x.efficiency, 0);
    return {
      avgWorkload: Math.round(wSum / arr.length),
      avgEfficiency: Math.round(eSum / arr.length),
    };
  };

  const peakStats = calcAvg(peakDays);
  const nonPeakStats = calcAvg(nonPeakDays);

  // Per-area peak vs non-peak comparison
  const areaComparison = {};
  const areasList = ['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory'];

  for (const area of areasList) {
    const areaPeakOps = operations.filter((op) => {
      const dateStr = new Date(op.date).toISOString().split('T')[0];
      return op.operationalArea === area && daysMap[dateStr]?.totalWorkload >= peakThreshold;
    });

    const areaNonPeakOps = operations.filter((op) => {
      const dateStr = new Date(op.date).toISOString().split('T')[0];
      return op.operationalArea === area && daysMap[dateStr]?.totalWorkload < peakThreshold;
    });

    const calcAreaStats = (ops) => {
      if (ops.length === 0) return { avgWorkload: 0, avgEfficiency: 0, avgUtilization: 0 };
      const w = ops.reduce((acc, x) => acc + (x.workload || 0), 0) / ops.length;
      const e = ops.reduce((acc, x) => acc + (x.efficiency || 0), 0) / ops.length;
      const u = ops.reduce((acc, x) => acc + (x.utilization || 0), 0) / ops.length;
      return {
        avgWorkload: Math.round(w),
        avgEfficiency: Math.round(e),
        avgUtilization: Math.round(u),
      };
    };

    areaComparison[area] = {
      peak: calcAreaStats(areaPeakOps),
      nonPeak: calcAreaStats(areaNonPeakOps),
    };
  }

  return {
    summary: {
      totalDaysAnalyzed: totalDays,
      peakDaysCount: peakDays.length,
      nonPeakDaysCount: nonPeakDays.length,
      peakThreshold: Math.round(peakThreshold),
      peakStats,
      nonPeakStats,
    },
    areaComparison,
    dailyTrends: daysList.map((d) => ({
      date: d.date,
      workload: d.totalWorkload,
      isPeak: d.totalWorkload >= peakThreshold,
    })),
  };
}

/**
 * Perform Operational & Delivery-Delay Risk Analysis
 */
async function getRiskAnalysis() {
  const capacityRecords = await Capacity.find({}).sort({ planningDate: -1 }).limit(6).lean();
  const openBottlenecks = await Bottleneck.find({ status: 'OPEN' }).lean();

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;

  const areaRisks = [];

  for (const cap of capacityRecords) {
    const area = cap.operationalArea;
    const gap = cap.capacityGap;
    const util = cap.utilization;

    let delayRiskLevel = 'LOW';
    let riskScore = 20;
    let reason = 'Capacity and processing velocity are within normal operating thresholds.';

    if (util > 130 || gap < -15) {
      delayRiskLevel = 'CRITICAL';
      riskScore = 95;
      reason = `Severe capacity deficit (${gap} workers) and excessive utilization (${util}%) indicate immediate delivery delay risk.`;
      criticalCount++;
    } else if (util > 110 || gap < -5) {
      delayRiskLevel = 'HIGH';
      riskScore = 80;
      reason = `High workload pressure (${util}% utilization, ${gap} workers gap) presents significant risk of order processing backlog.`;
      highCount++;
    } else if (util > 95 || gap < 0) {
      delayRiskLevel = 'MEDIUM';
      riskScore = 55;
      reason = `Tight capacity buffer (${gap} workers) may cause minor delays during afternoon peak hours.`;
      mediumCount++;
    }

    areaRisks.push({
      operationalArea: area,
      operationType: cap.operationType,
      forecastWorkload: cap.forecastWorkload,
      availableWorkforce: cap.availableWorkforce,
      requiredWorkforce: cap.requiredWorkforce,
      capacityGap: gap,
      utilization: util,
      riskLevel: cap.riskLevel,
      delayRiskLevel,
      riskScore,
      reason,
    });
  }

  // Overall facility risk
  let overallFacilityRisk = 'LOW';
  if (criticalCount > 0) overallFacilityRisk = 'CRITICAL';
  else if (highCount > 0) overallFacilityRisk = 'HIGH';
  else if (mediumCount > 0) overallFacilityRisk = 'MEDIUM';

  return {
    overallFacilityRisk,
    openBottlenecksCount: openBottlenecks.length,
    criticalAreaCount: criticalCount,
    highRiskAreaCount: highCount,
    areaRisks,
  };
}

/**
 * Contextual External Contributing Factors (Traffic & Weather)
 * Note: Uses non-causal phrasing per spec.
 */
function getContributingFactors() {
  return [
    {
      id: 'factor-1',
      category: 'WEATHER',
      title: 'Heavy Rain & Low Visibility',
      impactedOperations: ['INBOUND', 'Receiving'],
      description: 'Regional weather advisory causing reduced transport velocity on inbound freight routes.',
      phrasing: 'Possible contributing factor',
      severity: 'MEDIUM',
      icon: 'rain',
    },
    {
      id: 'factor-2',
      category: 'TRAFFIC',
      title: 'Interstate Highway Construction',
      impactedOperations: ['OUTBOUND', 'Shipping'],
      description: 'High-density congestion on major arterial outbound logistics corridor (+25 min delay).',
      phrasing: 'Possible contributing factor',
      severity: 'HIGH',
      icon: 'truck',
    },
    {
      id: 'factor-3',
      category: 'SEASONAL',
      title: 'Q3 High-Volume Surge',
      impactedOperations: ['OUTBOUND', 'Picking', 'Shipping'],
      description: 'Scheduled promotional dispatch volume surge driving peak outbound order processing.',
      phrasing: 'Possible contributing factor',
      severity: 'HIGH',
      icon: 'trending-up',
    },
  ];
}

module.exports = {
  getPeakAnalysis,
  getRiskAnalysis,
  getContributingFactors,
};
