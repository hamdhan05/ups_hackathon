import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PeakAnalysisProps {
  data: {
    summary?: {
      totalDaysAnalyzed?: number;
      peakDaysCount?: number;
      nonPeakDaysCount?: number;
      peakThreshold?: number;
      peakStats?: { avgWorkload: number; avgEfficiency: number };
      nonPeakStats?: { avgWorkload: number; avgEfficiency: number };
    };
    areaComparison?: Record<
      string,
      {
        peak: { avgWorkload: number; avgEfficiency: number; avgUtilization: number };
        nonPeak: { avgWorkload: number; avgEfficiency: number; avgUtilization: number };
      }
    >;
  };
}

export const PeakAnalysisCard: React.FC<PeakAnalysisProps> = ({ data }) => {
  const summary = data?.summary || {};
  const areaComp = data?.areaComparison || {};

  const chartData = Object.keys(areaComp).map((area) => ({
    name: area,
    'Peak Workload': areaComp[area]?.peak?.avgWorkload || 0,
    'Non-Peak Workload': areaComp[area]?.nonPeak?.avgWorkload || 0,
    'Peak Eff (%)': areaComp[area]?.peak?.avgEfficiency || 0,
    'Non-Peak Eff (%)': areaComp[area]?.nonPeak?.avgEfficiency || 0,
  }));

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">⚡</span> Peak vs Non-Peak Operational Analysis
          </h2>
          <p className="text-sm text-slate-400">
            Historical 90-day workload intensity and process efficiency distribution
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg">
            <span className="font-semibold">{summary.peakDaysCount || 0}</span> Peak Days (&gt;{summary.peakThreshold || 0} u/d)
          </div>
          <div className="bg-slate-700/50 border border-slate-600 text-slate-300 px-3 py-1.5 rounded-lg">
            <span className="font-semibold">{summary.nonPeakDaysCount || 0}</span> Regular Days
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Peak Avg Workload</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">
            {summary.peakStats?.avgWorkload?.toLocaleString() || 0} <span className="text-xs text-slate-400 font-normal">units</span>
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Peak Avg Efficiency</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">
            {summary.peakStats?.avgEfficiency || 0}%
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Regular Avg Workload</span>
          <span className="text-xl font-bold text-slate-200 mt-1 block">
            {summary.nonPeakStats?.avgWorkload?.toLocaleString() || 0} <span className="text-xs text-slate-400 font-normal">units</span>
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Regular Avg Efficiency</span>
          <span className="text-xl font-bold text-slate-300 mt-1 block">
            {summary.nonPeakStats?.avgEfficiency || 0}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8' }} />
            <Bar dataKey="Peak Workload" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Non-Peak Workload" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
