import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ForecastPoint {
  forecastDate: string;
  operationalArea?: string;
  forecastedVolume: number;
  confidence?: number;
}

interface HistoricalPoint {
  date: string;
  value: number;
}

interface ForecastChartProps {
  forecasts: ForecastPoint[];
  historical: HistoricalPoint[];
}

export default function ForecastChart({ forecasts, historical }: ForecastChartProps) {
  // Aggregate forecasts by date
  const forecastByDate: Record<string, number> = {};
  for (const f of forecasts) {
    const d = f.forecastDate.slice(0, 10);
    forecastByDate[d] = (forecastByDate[d] || 0) + f.forecastedVolume;
  }

  // Last 14 days historical
  const histSlice = historical.slice(-14).map((h) => ({
    date: h.date.slice(5),
    historical: h.value,
    forecast: null as number | null,
  }));

  // Next 7 days forecast
  const forecastSlice = Object.entries(forecastByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 7)
    .map(([date, vol]) => ({
      date: date.slice(5),
      historical: null as number | null,
      forecast: vol,
    }));

  const combined = [...histSlice, ...forecastSlice];

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Workload Forecast</h3>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-400 inline-block rounded"></span>Historical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block rounded border-dashed"></span>Forecast
          </span>
        </div>
      </div>
      {combined.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No forecast data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={combined} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="historical" fill="#3b82f6" fillOpacity={0.7} radius={[2, 2, 0, 0]} name="Historical" />
            <Bar dataKey="forecast" fill="#f59e0b" fillOpacity={0.7} radius={[2, 2, 0, 0]} name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
