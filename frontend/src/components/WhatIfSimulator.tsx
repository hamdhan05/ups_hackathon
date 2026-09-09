import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const WhatIfSimulator: React.FC = () => {
  const [targetArea, setTargetArea] = useState('Shipping');
  const [sourceArea, setSourceArea] = useState('Receiving');
  const [workloadChangePercent, setWorkloadChangePercent] = useState(25);
  const [workerTransferCount, setWorkerTransferCount] = useState(5);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.simulateScenario({
        targetArea,
        workloadChangePercent,
        workerTransferCount,
        sourceArea,
      });
      if (res.success) {
        setSimulationResult(res.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  }, [targetArea, workloadChangePercent, workerTransferCount, sourceArea]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const areas = ['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory'];

  const getBadgeStyle = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">🔮</span> P2 Interactive What-If Workload Simulator
          </h2>
          <p className="text-sm text-slate-400">
            Simulate volume spikes and test proactive resource redistribution before dispatching workers
          </p>
        </div>
        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-3 py-1.5 rounded-lg">
          AI Explanations Enabled
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Target Area (Demand Surge)
          </label>
          <select
            value={targetArea}
            onChange={(e) => setTargetArea(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Workload Change ({workloadChangePercent > 0 ? `+${workloadChangePercent}%` : `${workloadChangePercent}%`})
          </label>
          <input
            type="range"
            min="-50"
            max="100"
            step="5"
            value={workloadChangePercent}
            onChange={(e) => setWorkloadChangePercent(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Source Excess Area
          </label>
          <select
            value={sourceArea}
            onChange={(e) => setSourceArea(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            {areas
              .filter((a) => a !== targetArea)
              .map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Worker Reallocation (+{workerTransferCount} workers)
          </label>
          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={workerTransferCount}
            onChange={(e) => setWorkerTransferCount(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
          />
        </div>
      </div>

      {/* Simulation Results Display */}
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">Calculating projected simulation outcome...</div>
      ) : simulationResult ? (
        <div className="space-y-6">
          {/* Baseline vs Projected Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline */}
            <div className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Baseline State ({targetArea})
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Workload</span>
                  <span className="text-sm font-bold text-white">
                    {simulationResult.baseline.forecastWorkload.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Req / Avail</span>
                  <span className="text-sm font-bold text-amber-400">
                    {simulationResult.baseline.requiredWorkforce} / {simulationResult.baseline.availableWorkforce}
                  </span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Utilization</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {simulationResult.baseline.utilization}%
                  </span>
                </div>
              </div>
            </div>

            {/* Projected */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
                  Simulated Projected State ({targetArea})
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeStyle(
                    simulationResult.projected.simulatedRiskLevel
                  )}`}
                >
                  {simulationResult.projected.simulatedRiskLevel} RISK
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-indigo-500/20">
                  <span className="text-[10px] text-slate-400 block uppercase">Sim Workload</span>
                  <span className="text-sm font-bold text-indigo-300">
                    {simulationResult.projected.simulatedWorkload.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-indigo-500/20">
                  <span className="text-[10px] text-slate-400 block uppercase">Sim Req / Avail</span>
                  <span className="text-sm font-bold text-rose-400">
                    {simulationResult.projected.simulatedRequiredWorkforce} /{' '}
                    {simulationResult.projected.simulatedAvailableWorkforce}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-indigo-500/20">
                  <span className="text-[10px] text-slate-400 block uppercase">Sim Util</span>
                  <span className="text-sm font-bold text-amber-300">
                    {simulationResult.projected.simulatedUtilization}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Natural Language Insights Box */}
          <div className="bg-gradient-to-r from-indigo-950/50 via-slate-900 to-indigo-950/50 border border-indigo-500/30 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🤖</span> Natural-Language Intelligence Explanation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {simulationResult.naturalLanguageInsights?.explanation}
            </p>
            <div className="pt-2 border-t border-indigo-500/20 text-xs text-emerald-300 font-medium flex items-center gap-2">
              <span className="text-emerald-400 font-bold">Recommended Action:</span>
              <span>{simulationResult.naturalLanguageInsights?.recommendationSummary}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
