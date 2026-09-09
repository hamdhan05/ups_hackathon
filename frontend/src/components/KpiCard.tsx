import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  highlight?: 'danger' | 'warning' | 'success' | 'info' | 'default';
}

const highlightStyles = {
  danger: 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-slate-800/80',
  warning: 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-slate-800/80',
  success: 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-slate-800/80',
  info: 'border-blue-500/40 bg-gradient-to-br from-blue-500/10 to-slate-800/80',
  default: 'border-slate-700/50 bg-slate-800/60',
};

const highlightValueStyles = {
  danger: 'text-red-400',
  warning: 'text-amber-400',
  success: 'text-emerald-400',
  info: 'text-blue-400',
  default: 'text-white',
};

export default function KpiCard({ title, value, subtitle, icon, trend, trendValue, highlight = 'default' }: KpiCardProps) {
  return (
    <div className={`rounded-xl border p-5 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${highlightStyles[highlight]}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400">
            {icon}
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${highlightValueStyles[highlight]} mb-1`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      {trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium
          ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {trendValue}
        </div>
      )}
    </div>
  );
}
