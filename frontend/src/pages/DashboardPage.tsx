import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/TrendChart';
import ForecastChart from '../components/ForecastChart';
import WorkforceChart from '../components/WorkforceChart';
import BottleneckTable from '../components/BottleneckTable';
import RecommendationsTable from '../components/RecommendationsTable';

interface DashboardData {
  summary: {
    inboundWorkload: number;
    outboundWorkload: number;
    inventoryVolume: number;
    requiredWorkforce: number;
    availableWorkforce: number;
    capacityGap: number;
    averageEfficiency: number;
    averageUtilization: number;
    activeBottlenecks: number;
    pendingRecommendations: number;
  };
  trends: {
    inbound: { date: string; value: number }[];
    outbound: { date: string; value: number }[];
    inventory: { date: string; value: number }[];
    efficiency: { date: string; value: number }[];
    utilization: { date: string; value: number }[];
  };
  forecasts: any[];
  capacity: any[];
  bottlenecks: any[];
  recommendations: any[];
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchDashboard = useCallback(async () => {
    setError('');
    try {
      const res = await api.getDashboard();
      setData(res.data);
      setLastRefresh(new Date());
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Failed to load dashboard data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  function getCapacityGapHighlight(gap: number) {
    if (gap < -5) return 'danger';
    if (gap < 0) return 'warning';
    if (gap > 0) return 'success';
    return 'default';
  }

  function getUtilHighlight(util: number) {
    if (util > 100) return 'danger';
    if (util > 90) return 'warning';
    if (util < 70) return 'info';
    return 'success';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">LogiPulse</h1>
              <p className="text-xs text-slate-500">Predictive Operations Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500
                rounded-lg transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Operations Dashboard</h2>
            <p className="text-sm text-slate-400 mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg
              hover:bg-blue-600/30 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 px-5 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-28 bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-52 bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {data && (
          <>
            {/* ─── KPI Cards ─────────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Current Operations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                  title="Inbound Workload"
                  value={data.summary.inboundWorkload.toLocaleString()}
                  subtitle="units (30-day)"
                  highlight="info"
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
                />
                <KpiCard
                  title="Outbound Workload"
                  value={data.summary.outboundWorkload.toLocaleString()}
                  subtitle="units (30-day)"
                  highlight="info"
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                />
                <KpiCard
                  title="Inventory Volume"
                  value={data.summary.inventoryVolume.toLocaleString()}
                  subtitle="units (30-day)"
                  highlight="default"
                  icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                />
                <KpiCard
                  title="Avg. Efficiency"
                  value={`${data.summary.averageEfficiency}%`}
                  subtitle="process efficiency"
                  highlight={data.summary.averageEfficiency >= 90 ? 'success' : data.summary.averageEfficiency >= 70 ? 'default' : 'warning'}
                />
              </div>
            </section>

            {/* ─── Workforce KPIs ─────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Workforce & Capacity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                  title="Required Workforce"
                  value={data.summary.requiredWorkforce}
                  subtitle="workers needed today"
                  highlight="warning"
                />
                <KpiCard
                  title="Available Workforce"
                  value={data.summary.availableWorkforce}
                  subtitle="workers available"
                  highlight="info"
                />
                <KpiCard
                  title="Capacity Gap"
                  value={data.summary.capacityGap > 0 ? `+${data.summary.capacityGap}` : data.summary.capacityGap}
                  subtitle={data.summary.capacityGap < 0 ? 'shortage' : data.summary.capacityGap > 0 ? 'excess' : 'balanced'}
                  highlight={getCapacityGapHighlight(data.summary.capacityGap)}
                />
                <KpiCard
                  title="Avg. Utilization"
                  value={`${data.summary.averageUtilization}%`}
                  subtitle={data.summary.averageUtilization > 100 ? 'OVERUTILIZED' : data.summary.averageUtilization < 70 ? 'UNDERUTILIZED' : 'NORMAL'}
                  highlight={getUtilHighlight(data.summary.averageUtilization)}
                />
              </div>
            </section>

            {/* Status badges */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${data.summary.activeBottlenecks > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-xs text-slate-300">
                  <span className="font-bold text-red-400">{data.summary.activeBottlenecks}</span> Active Bottlenecks
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${data.summary.pendingRecommendations > 0 ? 'bg-amber-500' : 'bg-slate-500'}`} />
                <span className="text-xs text-slate-300">
                  <span className="font-bold text-amber-400">{data.summary.pendingRecommendations}</span> Pending Recommendations
                </span>
              </div>
            </div>

            {/* ─── Trend Charts ────────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Historical Trends (30 days)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TrendChart title="Inbound Volume" data={data.trends.inbound} color="#3b82f6" />
                <TrendChart title="Outbound Volume" data={data.trends.outbound} color="#f59e0b" />
                <TrendChart title="Inventory Volume" data={data.trends.inventory} color="#8b5cf6" />
                <TrendChart title="Process Efficiency (%)" data={data.trends.efficiency} color="#10b981" valueFormatter={(v) => `${v}%`} />
                <TrendChart title="Utilization (%)" data={data.trends.utilization} color="#ef4444" valueFormatter={(v) => `${v}%`} />
                <ForecastChart
                  forecasts={data.forecasts}
                  historical={data.trends.outbound}
                />
              </div>
            </section>

            {/* ─── Workforce Chart ─────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Workforce & Capacity Analysis</h3>
              <WorkforceChart capacity={data.capacity} />
            </section>

            {/* ─── Capacity Table ──────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Area Capacity Status</h3>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Area</th>
                      <th className="text-left text-xs font-medium text-slate-400 px-4 py-3">Type</th>
                      <th className="text-right text-xs font-medium text-slate-400 px-4 py-3">Forecast</th>
                      <th className="text-right text-xs font-medium text-slate-400 px-4 py-3">Required</th>
                      <th className="text-right text-xs font-medium text-slate-400 px-4 py-3">Available</th>
                      <th className="text-right text-xs font-medium text-slate-400 px-4 py-3">Gap</th>
                      <th className="text-right text-xs font-medium text-slate-400 px-4 py-3">Util%</th>
                      <th className="text-center text-xs font-medium text-slate-400 px-4 py-3">Status</th>
                      <th className="text-center text-xs font-medium text-slate-400 px-4 py-3">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.capacity.map((cap: any) => (
                      <tr key={cap._id} className="border-b border-slate-800/50 hover:bg-slate-700/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-white">{cap.operationalArea}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{cap.operationType}</td>
                        <td className="px-4 py-3 text-right text-slate-300">{cap.forecastWorkload.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-red-400 font-semibold">{cap.requiredWorkforce}</td>
                        <td className="px-4 py-3 text-right text-blue-400 font-semibold">{cap.availableWorkforce}</td>
                        <td className={`px-4 py-3 text-right font-bold ${cap.capacityGap < 0 ? 'text-red-400' : cap.capacityGap > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {cap.capacityGap > 0 ? '+' : ''}{cap.capacityGap}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${cap.utilization > 100 ? 'text-red-400' : cap.utilization > 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {cap.utilization}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 text-xs rounded font-medium
                            ${cap.status === 'UNDER_CAPACITY' ? 'bg-red-500/20 text-red-400' :
                              cap.status === 'OVER_CAPACITY' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-slate-600/30 text-slate-400'}`}>
                            {cap.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 text-xs rounded font-medium
                            ${cap.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                              cap.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                              cap.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'}`}>
                            {cap.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ─── Bottlenecks ─────────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Bottleneck Detection</h3>
              <BottleneckTable bottlenecks={data.bottlenecks} />
            </section>

            {/* ─── Recommendations ─────────────────────────────────────────── */}
            <section className="mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Resource Allocation Recommendations</h3>
              <RecommendationsTable
                recommendations={data.recommendations}
                onStatusUpdate={fetchDashboard}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
