import React from 'react';

interface AreaRisk {
  operationalArea: string;
  operationType: string;
  forecastWorkload: number;
  availableWorkforce: number;
  requiredWorkforce: number;
  capacityGap: number;
  utilization: number;
  riskLevel: string;
  delayRiskLevel: string;
  riskScore: number;
  reason: string;
}

interface ContributingFactor {
  id: string;
  category: string;
  title: string;
  impactedOperations: string[];
  description: string;
  phrasing: string;
  severity: string;
  icon: string;
}

interface RiskIntelligenceProps {
  riskData: {
    overallFacilityRisk?: string;
    openBottlenecksCount?: number;
    criticalAreaCount?: number;
    highRiskAreaCount?: number;
    areaRisks?: AreaRisk[];
  };
  contributingFactors: ContributingFactor[];
}

export const RiskIntelligenceCard: React.FC<RiskIntelligenceProps> = ({ riskData, contributingFactors }) => {
  const overall = riskData?.overallFacilityRisk || 'LOW';
  const areaRisks = riskData?.areaRisks || [];

  const getBadgeStyle = (level: string) => {
    switch (level) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'WEATHER':
        return '🌧️';
      case 'TRAFFIC':
        return '🚛';
      case 'SEASONAL':
        return '📈';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-rose-400">🛡️</span> Operational Risk & Delivery Delay Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Process delay risk scores and contextual environmental contributing factors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Facility Status:</span>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getBadgeStyle(overall)}`}>
            {overall} RISK
          </span>
        </div>
      </div>

      {/* Contributing factors badges */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          External Contributing Factors (Non-Causal Context)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {contributingFactors.map((factor) => (
            <div
              key={factor.id}
              className="bg-slate-900/70 border border-slate-700/60 p-3.5 rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>{getCategoryIcon(factor.category)}</span> {factor.title}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {factor.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{factor.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono italic">"{factor.phrasing}"</span>
                <span className="text-slate-400 font-semibold">{factor.impactedOperations.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Area Risk Table */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Process-Level Delay Risk Assessment
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs">
              <tr>
                <th className="py-2.5 px-3">Area</th>
                <th className="py-2.5 px-3">Workload</th>
                <th className="py-2.5 px-3">Req / Avail</th>
                <th className="py-2.5 px-3">Util (%)</th>
                <th className="py-2.5 px-3">Delivery Delay Risk</th>
                <th className="py-2.5 px-3">Assessment Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {areaRisks.map((item) => (
                <tr key={item.operationalArea} className="hover:bg-slate-700/30">
                  <td className="py-3 px-3 font-semibold text-white">{item.operationalArea}</td>
                  <td className="py-3 px-3 font-mono">{item.forecastWorkload.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-rose-400 font-semibold">{item.requiredWorkforce}</span> /{' '}
                    <span className="text-emerald-400 font-semibold">{item.availableWorkforce}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">{item.utilization}%</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getBadgeStyle(item.delayRiskLevel)}`}>
                      {item.delayRiskLevel} ({item.riskScore})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-400 max-w-xs leading-normal">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
