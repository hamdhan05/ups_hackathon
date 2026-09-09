import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendPoint {
  date: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  data: TrendPoint[];
  color?: string;
  yLabel?: string;
  valueFormatter?: (v: number) => string;
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-semibold">
          {valueFormatter ? valueFormatter(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ title, data, color = '#3b82f6', yLabel, valueFormatter }: TrendChartProps) {
  // Show last 30 points
  const displayData = data.slice(-30).map((d) => ({
    date: d.date.slice(5), // MM-DD
    value: d.value,
  }));

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      {displayData.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={displayData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 } : undefined}
            />
            <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
