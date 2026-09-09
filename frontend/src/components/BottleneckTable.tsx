import React from 'react';

interface BottleneckItem {
  _id: string;
  operationalArea: string;
  operationType: string;
  severity: string;
  capacityGap: number;
  utilization: number;
  reason: string;
  status: string;
  workload: number;
  requiredWorkforce: number;
  availableWorkforce: number;
}

interface BottleneckTableProps {
  bottlenecks: BottleneckItem[];
}

const severityStyles = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  LOW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function BottleneckTable({ bottlenecks }: BottleneckTableProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Active Bottlenecks</h3>
        <span className="text-xs text-slate-400">{bottlenecks.length} active</span>
      </div>

      {bottlenecks.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">No active bottlenecks</div>
      ) : (
        <div className="space-y-3">
          {bottlenecks.map((b) => (
            <div key={b._id}
              className="border border-slate-700/50 rounded-lg p-4 bg-slate-900/40 hover:border-slate-600/50 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{b.operationalArea}</span>
                  <span className="text-xs text-slate-500">· {b.operationType}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${severityStyles[b.severity as keyof typeof severityStyles] || severityStyles.LOW}`}>
                  {b.severity}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-500">Workload</p>
                  <p className="text-sm font-semibold text-white">{b.workload.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Required</p>
                  <p className="text-sm font-semibold text-red-400">{b.requiredWorkforce}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Available</p>
                  <p className="text-sm font-semibold text-blue-400">{b.availableWorkforce}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Utilization</p>
                  <p className={`text-sm font-semibold ${b.utilization > 100 ? 'text-red-400' : b.utilization > 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {b.utilization}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{b.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
