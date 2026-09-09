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
  ReferenceLine,
} from 'recharts';

interface CapacityItem {
  operationalArea: string;
  requiredWorkforce: number;
  availableWorkforce: number;
  capacityGap: number;
  utilization: number;
  status: string;
  riskLevel: string;
}

interface WorkforceChartProps {
  capacity: CapacityItem[];
}

const statusColors = {
  UNDER_CAPACITY: '#ef4444',
  BALANCED: '#10b981',
  OVER_CAPACITY: '#3b82f6',
};

export default function WorkforceChart({ capacity }: WorkforceChartProps) {
  const data = capacity.map((c) => ({
    area: c.operationalArea,
    Required: c.requiredWorkforce,
    Available: c.availableWorkforce,
    gap: c.capacityGap,
    status: c.status,
    util: c.utilization,
    risk: c.riskLevel,
  }));

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Workforce: Required vs Available</h3>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No capacity data</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="area" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend iconType="rect" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="Required" fill="#ef4444" fillOpacity={0.85} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Available" fill="#3b82f6" fillOpacity={0.85} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Capacity gap table */}
          <div className="mt-4 space-y-1.5">
            {data.map((row) => {
              const isShortage = row.gap < 0;
              const isExcess = row.gap > 0;
              return (
                <div key={row.area} className="flex items-center justify-between text-xs px-2">
                  <span className="text-slate-400 w-24">{row.area}</span>
                  <span className="text-slate-500">Util: {row.util}%</span>
                  <span className={`font-semibold ${isShortage ? 'text-red-400' : isExcess ? 'text-emerald-400' : 'text-slate-400'}`}>
                    Gap: {row.gap > 0 ? '+' : ''}{row.gap}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium
                    ${row.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      row.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      row.risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'}`}>
                    {row.risk}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
