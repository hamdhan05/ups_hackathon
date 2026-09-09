'use strict';

const Capacity = require('../models/Capacity');
const {
  calculateRequiredWorkforce,
  calculateCapacityGap,
  calculateUtilization,
  getCapacityStatus,
  getRiskLevel,
  getCapacityPerWorker,
} = require('./workforceService');

/**
 * Simulate What-If Scenarios
 * @param {Object} params
 * @param {string} params.targetArea - Operational area to simulate (e.g. Shipping)
 * @param {number} params.workloadChangePercent - Percentage change in volume (-50 to +100)
 * @param {number} params.workerTransferCount - Workers transferred from excess area to target
 * @param {string} params.sourceArea - Source excess area (e.g. Receiving)
 */
async function simulateScenario({
  targetArea = 'Shipping',
  workloadChangePercent = 20,
  workerTransferCount = 0,
  sourceArea = 'Receiving',
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentRecords = await Capacity.find({ planningDate: today }).lean();
  const targetCap = currentRecords.find((c) => c.operationalArea === targetArea);
  const sourceCap = currentRecords.find((c) => c.operationalArea === sourceArea);

  if (!targetCap) {
    throw new Error(`Area ${targetArea} not found in capacity records`);
  }

  // Base values
  const baseVolume = targetCap.forecastWorkload;
  const baseAvail = targetCap.availableWorkforce;

  // Simulated values
  const multiplier = 1 + workloadChangePercent / 100;
  const simulatedVolume = Math.round(baseVolume * multiplier);
  const simulatedTargetAvail = baseAvail + Number(workerTransferCount);

  const cpw = getCapacityPerWorker(targetArea);
  const simRequired = calculateRequiredWorkforce(simulatedVolume, targetArea);
  const simGap = calculateCapacityGap(simulatedTargetAvail, simRequired);
  const simProcessingCap = simulatedTargetAvail * cpw;
  const simUtil = calculateUtilization(simulatedVolume, simProcessingCap);
  const simStatus = getCapacityStatus(simGap);
  const simRisk = getRiskLevel(simGap, simUtil);

  // Source area impact if workers transferred
  let sourceImpact = null;
  if (sourceCap && workerTransferCount > 0) {
    const srcCpw = getCapacityPerWorker(sourceArea);
    const srcSimAvail = Math.max(0, sourceCap.availableWorkforce - workerTransferCount);
    const srcSimRequired = sourceCap.requiredWorkforce;
    const srcSimGap = calculateCapacityGap(srcSimAvail, srcSimRequired);
    const srcSimUtil = calculateUtilization(sourceCap.forecastWorkload, srcSimAvail * srcCpw);
    sourceImpact = {
      operationalArea: sourceArea,
      baseAvailable: sourceCap.availableWorkforce,
      simulatedAvailable: srcSimAvail,
      simulatedGap: srcSimGap,
      simulatedUtilization: srcSimUtil,
      status: getCapacityStatus(srcSimGap),
    };
  }

  // Natural Language Explanation
  let explanation = '';
  let recommendationSummary = '';

  if (workloadChangePercent > 0) {
    explanation = `A ${workloadChangePercent}% volume surge in ${targetArea} increases daily demand from ${baseVolume.toLocaleString()} to ${simulatedVolume.toLocaleString()} units. `;
  } else if (workloadChangePercent < 0) {
    explanation = `A ${Math.abs(workloadChangePercent)}% volume reduction in ${targetArea} decreases projected demand from ${baseVolume.toLocaleString()} to ${simulatedVolume.toLocaleString()} units. `;
  } else {
    explanation = `At baseline forecast demand (${baseVolume.toLocaleString()} units), `;
  }

  if (simGap < 0) {
    explanation += `This creates a workforce deficit of ${Math.abs(simGap)} worker(s) and drives process utilization to ${simUtil}% (${simRisk} risk).`;
  } else {
    explanation += `Available workforce capacity is sufficient, maintaining process utilization at an optimal ${simUtil}%.`;
  }

  if (workerTransferCount > 0 && sourceCap) {
    recommendationSummary = `Reallocating ${workerTransferCount} worker(s) from ${sourceArea} to ${targetArea} improves ${targetArea}'s capacity gap to ${simGap > 0 ? '+' : ''}${simGap} workers and lowers process utilization to ${simUtil}%. ${sourceArea} retains a surplus gap of ${sourceImpact?.simulatedGap || 0} worker(s).`;
  } else if (simGap < 0) {
    const suggestedTransfer = Math.min(sourceCap ? Math.max(0, sourceCap.capacityGap) : 0, Math.abs(simGap));
    if (suggestedTransfer > 0) {
      recommendationSummary = `Suggested Action: Transfer ${suggestedTransfer} worker(s) from ${sourceArea} (excess capacity gap: +${sourceCap.capacityGap}) to mitigate the projected bottleneck in ${targetArea}.`;
    } else {
      recommendationSummary = `Suggested Action: Approve temporary shift expansion to absorb the ${Math.abs(simGap)} worker shortfall in ${targetArea}.`;
    }
  } else {
    recommendationSummary = `Operations remain balanced. No immediate workforce shift required.`;
  }

  return {
    scenario: {
      targetArea,
      workloadChangePercent,
      workerTransferCount,
      sourceArea,
    },
    baseline: {
      forecastWorkload: baseVolume,
      availableWorkforce: baseAvail,
      requiredWorkforce: targetCap.requiredWorkforce,
      capacityGap: targetCap.capacityGap,
      utilization: targetCap.utilization,
      riskLevel: targetCap.riskLevel,
    },
    projected: {
      simulatedWorkload: simulatedVolume,
      simulatedAvailableWorkforce: simulatedTargetAvail,
      simulatedRequiredWorkforce: simRequired,
      simulatedCapacityGap: simGap,
      simulatedUtilization: simUtil,
      simulatedStatus: simStatus,
      simulatedRiskLevel: simRisk,
    },
    sourceImpact,
    naturalLanguageInsights: {
      explanation,
      recommendationSummary,
    },
  };
}

module.exports = {
  simulateScenario,
};
