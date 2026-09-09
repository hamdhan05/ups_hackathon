'use strict';

const simulationService = require('../services/simulationService');
const { success, error } = require('../utils/response');

async function runSimulation(req, res, next) {
  try {
    const { targetArea, workloadChangePercent, workerTransferCount, sourceArea } = req.body;

    const result = await simulationService.simulateScenario({
      targetArea,
      workloadChangePercent: workloadChangePercent !== undefined ? Number(workloadChangePercent) : 20,
      workerTransferCount: workerTransferCount !== undefined ? Number(workerTransferCount) : 0,
      sourceArea,
    });

    return success(res, result, 'Simulation completed successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  runSimulation,
};
