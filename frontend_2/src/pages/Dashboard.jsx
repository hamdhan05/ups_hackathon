import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertTriangle, TrendingUp, Users, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const { selectedFacility, setSelectedFacility, loading: authLoading, token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [opArea, setOpArea] = useState(selectedFacility || 'Mumbai');
  const [opType, setOpType] = useState('all');
  const [opDate, setOpDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (selectedFacility) {
      setOpArea(selectedFacility);
    }
  }, [selectedFacility]);

  // Simulation state
  const [simTargetArea, setSimTargetArea] = useState('Shipping');
  const [simSourceArea, setSimSourceArea] = useState('Receiving');
  const [simWorkloadChange, setSimWorkloadChange] = useState(25);
  const [simWorkerTransfer, setSimWorkerTransfer] = useState(5);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getDashboard({ location: opArea });
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Unable to fetch live logistics operations data from backend server.');
    } finally {
      setLoading(false);
    }
  }, [opArea]);

  const runSimulation = useCallback(async () => {
    setSimLoading(true);
    try {
      const res = await api.simulateScenario({
        targetArea: simTargetArea,
        workloadChangePercent: simWorkloadChange,
        workerTransferCount: simWorkerTransfer,
        sourceArea: simSourceArea,
      });
      if (res.success) {
        setSimResult(res.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimLoading(false);
    }
  }, [simTargetArea, simWorkloadChange, simWorkerTransfer, simSourceArea]);

  useEffect(() => {
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [authLoading, token, fetchDashboardData]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleTrackOperations = (e) => {
    e.preventDefault();
    setIsSearching(true);
    fetchDashboardData().finally(() => setIsSearching(false));
  };

  const getBadgeStyle = (statusOrRisk) => {
    switch (statusOrRisk) {
      case 'CRITICAL':
      case 'UNDER_CAPACITY':
      case 'AT_RISK':
        return 'badge-yellow';
      case 'HIGH':
      case 'DELAYED':
        return 'badge-yellow';
      case 'MEDIUM':
        return 'badge-blue';
      default:
        return 'badge-green';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ padding: '3rem 8%', color: '#330000' }}>
        <div className="page-header-block">
          <h1 className="page-title">Operations Overview</h1>
          <div className="heading-accent-line"></div>
          <p className="page-subtitle">Loading LogiPulse predictive logistics intelligence from backend...</p>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {
    inboundWorkload: 0,
    outboundWorkload: 0,
    inventoryVolume: 0,
    requiredWorkforce: 0,
    availableWorkforce: 0,
    capacityGap: 0,
    averageEfficiency: 0,
    averageUtilization: 0,
    activeBottlenecks: 0,
    pendingRecommendations: 0,
  };

  const trends = data?.trends || { inbound: [], outbound: [], inventory: [], efficiency: [], utilization: [] };
  const capacity = data?.capacity || [];
  const bottlenecks = data?.bottlenecks || [];
  const recommendations = data?.recommendations || [];
  const p1 = data?.p1 || {};

  // Formatted chart data for Recharts
  const trendChartData = (trends.outbound || []).slice(-14).map((item, idx) => ({
    date: item.date,
    Outbound: item.value,
    Inbound: trends.inbound?.[idx]?.value || 0,
    Inventory: trends.inventory?.[idx]?.value || 0,
  }));

  const areaComparison = p1.peakAnalysis?.areaComparison || {};
  const peakChartData = Object.keys(areaComparison).map((area) => ({
    name: area,
    'Peak Volume': areaComparison[area]?.peak?.avgWorkload || 0,
    'Regular Volume': areaComparison[area]?.nonPeak?.avgWorkload || 0,
  }));

  return (
    <div className="dashboard-container">
      {/* PAGE HEADER WITH UPS BENCHMARK TYPOGRAPHY */}
      <div className="page-header-block">
        <h1 className="page-title">Operations Overview</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Real-time facility throughput, workforce capacity, predictive bottleneck resolution, and package flow intelligence.
        </p>
      </div>

      {error && (
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '6px', color: '#C53030', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchDashboardData()}
            className="ups-button-gold"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* HERO SEARCH/FILTER CARD */}
      <div className="hero-tracking-card">
        <div className="hero-tracking-title">Track Operational Intelligence</div>
        <p className="hero-tracking-subtitle">
          Select facility criteria to analyze hub capacity, shift forecasts, and throughput bottleneck status.
        </p>

        <form onSubmit={handleTrackOperations} className="tracking-filter-grid">
          <div className="filter-field-group">
            <label>Operational Area / Facility</label>
            <select
              className="ups-select"
              value={opArea}
              onChange={(e) => {
                setOpArea(e.target.value);
                setSelectedFacility(e.target.value);
              }}
            >
              <option value="Mumbai">Mumbai</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Chennai">Chennai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div className="filter-field-group">
            <label>Operation Type</label>
            <select className="ups-select" value={opType} onChange={(e) => setOpType(e.target.value)}>
              <option value="all">All Operations (Inbound & Outbound)</option>
              <option value="inbound">Inbound Air Freight Sort</option>
              <option value="outbound">Outbound Linehaul Freight</option>
              <option value="inventory">Inventory Staging</option>
            </select>
          </div>

          <div className="filter-field-group">
            <label>Operation Date</label>
            <input
              type="date"
              className="ups-input"
              value={opDate}
              onChange={(e) => setOpDate(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-ups-primary" disabled={isSearching}>
            {isSearching ? 'Analyzing...' : 'Track Operations →'}
          </button>
        </form>
      </div>

      {/* OPERATIONAL STATUS BANNER */}
      <div className={`op-status-banner ${summary.capacityGap < 0 ? 'op-status-warning' : ''}`}>
        <div className="op-status-text">
          <h4>
            Operational Status:{' '}
            {summary.capacityGap < 0
              ? `Capacity Warning — Deficit of ${Math.abs(summary.capacityGap)} Sorters`
              : 'Balanced Operations — Optimal Throughput'}
          </h4>
          <p>
            Facility <strong>{opArea}</strong> has <strong>{summary.activeBottlenecks} active bottlenecks</strong> and{' '}
            <strong>{summary.pendingRecommendations} pending worker reallocations</strong>. Process utilization is at{' '}
            <strong>{summary.averageUtilization}%</strong>.
          </p>
        </div>
        <button className="btn-ups-secondary" onClick={() => navigate('/recommendations')}>
          View Recommendations →
        </button>
      </div>

      {/* KPI NUMBERS (3-CARD SPACIOUS ROW) */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Workload Volume</div>
          <div className="kpi-number">
            {(summary.inboundWorkload + summary.outboundWorkload).toLocaleString()}
          </div>
          <div className="kpi-unit">packages processed (Inbound & Outbound)</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Workforce Coverage</div>
          <div className="kpi-number">
            {summary.availableWorkforce} / {summary.requiredWorkforce}
          </div>
          <div className="kpi-unit">
            active sorters ({summary.capacityGap < 0 ? `${summary.capacityGap} gap` : 'optimal coverage'})
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Capacity Load & Efficiency</div>
          <div className="kpi-number">{summary.averageUtilization}%</div>
          <div className="kpi-unit">
            utilization rate ({summary.averageEfficiency}% process efficiency)
          </div>
        </div>
      </div>

      {/* HISTORICAL TREND & FORECAST CHARTS */}
      <div className="ups-card" style={{ marginBottom: '2rem' }}>
        <div className="ups-card-header">
          <h2 className="card-heading">14-Day Throughput Trend & Volume Distribution</h2>
          <button className="link-ups-blue" onClick={() => navigate('/operations')}>
            View Operations Matrix <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#FAF9F8', borderColor: '#D9D7D3', color: '#330000' }} />
              <Legend wrapperStyle={{ color: '#330000' }} />
              <Line type="monotone" dataKey="Outbound" stroke="#351C15" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Inbound" stroke="#D97706" strokeWidth={2} />
              <Line type="monotone" dataKey="Inventory" stroke="#0667B9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AREA CAPACITY STATUS TABLE */}
      <div className="ups-card" style={{ marginBottom: '2rem' }}>
        <div className="ups-card-header">
          <h2 className="card-heading">Area Capacity Status</h2>
          <button className="link-ups-blue" onClick={() => navigate('/capacity')}>
            View All Areas <ChevronRight size={14} />
          </button>
        </div>
        <div className="ups-table-container">
          <table className="ups-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Type</th>
                <th>Forecasted Workload</th>
                <th>Required / Available</th>
                <th>Capacity Gap</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {capacity.map((cap) => (
                <tr key={cap._id || cap.operationalArea}>
                  <td style={{ fontWeight: '500', color: '#330000' }}>{cap.operationalArea}</td>
                  <td style={{ color: '#64748B', fontSize: '13px' }}>{cap.operationType}</td>
                  <td style={{ fontFamily: 'monospace' }}>{cap.forecastWorkload?.toLocaleString()}</td>
                  <td style={{ fontFamily: 'monospace' }}>
                    <span style={{ color: '#C53030', fontWeight: '600' }}>{cap.requiredWorkforce}</span> /{' '}
                    <span style={{ color: '#2F855A', fontWeight: '600' }}>{cap.availableWorkforce}</span>
                  </td>
                  <td style={{ fontWeight: '700', color: cap.capacityGap < 0 ? '#C53030' : '#2F855A' }}>
                    {cap.capacityGap > 0 ? '+' : ''}{cap.capacityGap}
                  </td>
                  <td style={{ fontWeight: '600' }}>{cap.utilization}%</td>
                  <td>
                    <span className={`ups-badge ${getBadgeStyle(cap.status)}`}>
                      {cap.status?.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* P1 OPERATIONAL INTELLIGENCE & RISK SECTION */}
      {p1.riskAnalysis && (
        <div className="ups-card" style={{ marginBottom: '2rem' }}>
          <div className="ups-card-header">
            <h2 className="card-heading">P1 Operational Intelligence & Risk Analytics</h2>
            <span className={`ups-badge ${getBadgeStyle(p1.riskAnalysis.overallFacilityRisk)}`}>
              Facility Status: {p1.riskAnalysis.overallFacilityRisk} RISK
            </span>
          </div>

          {/* Environmental Contributing Factors */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              External Contributing Factors (Non-Causal Context)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {(p1.contributingFactors || []).map((factor) => (
                <div key={factor.id} style={{ padding: '1rem', border: '1px solid #D9D7D3', borderRadius: '6px', backgroundColor: '#FFFDF5', borderLeft: '4px solid #D97706' }}>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#330000', fontSize: '15px' }}>{factor.title}</span>
                    <span className="ups-badge badge-yellow" style={{ fontSize: '11px' }}>{factor.severity}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#4A5568', margin: '6px 0 10px 0' }}>{factor.description}</p>
                  <div style={{ fontSize: '11px', color: '#718096', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between' }}>
                    <span>"{factor.phrasing}"</span>
                    <span style={{ fontWeight: '600' }}>{factor.impactedOperations.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Analysis Chart */}
          {peakChartData.length > 0 && (
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                90-Day Peak vs Regular Workload Distribution
              </h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#FAF9F8', borderColor: '#D9D7D3', color: '#330000' }} />
                    <Legend wrapperStyle={{ color: '#330000' }} />
                    <Bar dataKey="Peak Volume" fill="#D97706" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Regular Volume" fill="#0667B9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* P2 INTERACTIVE WHAT-IF WORKLOAD SIMULATOR */}
      <div className="ups-card" style={{ marginBottom: '2rem', border: '1px solid #C7D2FE', backgroundColor: '#F5F3FF' }}>
        <div className="ups-card-header">
          <h2 className="card-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#4F46E5" /> P2 Interactive What-If Workload Simulator
          </h2>
          <span className="ups-badge badge-blue">AI Intelligence Enabled</span>
        </div>

        <p style={{ fontSize: '14px', color: '#4C1D95', marginBottom: '1.2rem' }}>
          Simulate volume spikes and test proactive resource redistribution before dispatching workers.
        </p>

        {/* Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '6px', border: '1px solid #DDD6FE', marginBottom: '1.2rem' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#4C1D95', display: 'block', marginBottom: '4px' }}>
              Target Area (Surge)
            </label>
            <select
              className="ups-select"
              value={simTargetArea}
              onChange={(e) => setSimTargetArea(e.target.value)}
            >
              {['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory'].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#4C1D95', display: 'block', marginBottom: '4px' }}>
              Volume Surge ({simWorkloadChange > 0 ? `+${simWorkloadChange}%` : `${simWorkloadChange}%`})
            </label>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={simWorkloadChange}
              onChange={(e) => setSimWorkloadChange(Number(e.target.value))}
              style={{ width: '100%', marginTop: '6px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#4C1D95', display: 'block', marginBottom: '4px' }}>
              Source Excess Area
            </label>
            <select
              className="ups-select"
              value={simSourceArea}
              onChange={(e) => setSimSourceArea(e.target.value)}
            >
              {['Receiving', 'Putaway', 'Picking', 'Packing', 'Shipping', 'Inventory']
                .filter((a) => a !== simTargetArea)
                .map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#4C1D95', display: 'block', marginBottom: '4px' }}>
              Worker Reallocation (+{simWorkerTransfer})
            </label>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={simWorkerTransfer}
              onChange={(e) => setSimWorkerTransfer(Number(e.target.value))}
              style={{ width: '100%', marginTop: '6px' }}
            />
          </div>
        </div>

        {/* Simulation Result Box */}
        {simLoading ? (
          <div style={{ fontSize: '14px', color: '#4C1D95', padding: '1rem', textCenter: 'center' }}>Running simulation model...</div>
        ) : simResult ? (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C7D2FE', borderRadius: '6px', padding: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#FAF9F8', border: '1px solid #D9D7D3', borderRadius: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Baseline State ({simTargetArea})</span>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#330000', marginTop: '4px' }}>
                  Workload: {simResult.baseline.forecastWorkload.toLocaleString()} | Util: {simResult.baseline.utilization}%
                </div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Simulated State ({simTargetArea})</span>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#312E81', marginTop: '4px' }}>
                  Workload: {simResult.projected.simulatedWorkload.toLocaleString()} | Util: {simResult.projected.simulatedUtilization}%
                </div>
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F5F3FF', borderLeft: '4px solid #6366F1', borderRadius: '4px', fontSize: '13px', color: '#3730A3' }}>
              <strong>AI Natural-Language Insight:</strong> {simResult.naturalLanguageInsights?.explanation}
              <div style={{ marginTop: '6px', fontWeight: '600', color: '#27272A' }}>
                {simResult.naturalLanguageInsights?.recommendationSummary}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ACTIVE FACILITY BOTTLENECK SECTION */}
      <div className="ups-card" style={{ marginBottom: '2rem' }}>
        <div className="ups-card-header">
          <h2 className="card-heading">Active Facility Bottlenecks</h2>
          <button className="link-ups-blue" onClick={() => navigate('/bottlenecks')}>
            View All Bottlenecks <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bottlenecks.length === 0 ? (
            <div style={{ fontSize: '14px', color: '#64748B', padding: '1rem' }}>No active bottlenecks detected.</div>
          ) : (
            bottlenecks.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: '1rem 1.2rem',
                  border: '1px solid #D9D7D3',
                  borderRadius: '4px',
                  backgroundColor: '#FFFDF5',
                  borderLeft: '4px solid #D97706',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#330000', fontSize: '16px', marginBottom: '2px' }}>
                    {item.operationalArea} ({item.operationType}) — {item.utilization}% Capacity Utilization
                  </div>
                  <div style={{ fontSize: '14px', color: '#555555' }}>{item.reason}</div>
                </div>
                <span className={`ups-badge ${getBadgeStyle(item.severity)}`}>{item.severity}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RECOMMENDED OPERATIONAL ACTIONS */}
      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Proactive Resource Allocation Recommendations</h2>
          <button className="link-ups-blue" onClick={() => navigate('/recommendations')}>
            View All Recommendations <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recommendations.map((rec) => {
            const isAccepted = rec.status === 'ACCEPTED' || rec.status === 'COMPLETED';

            return (
              <div
                key={rec._id}
                style={{
                  padding: '1.2rem',
                  backgroundColor: isAccepted ? '#FAFAFA' : '#FFFDF5',
                  border: `1px solid ${isAccepted ? '#E0E0E0' : '#FFE082'}`,
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#330000', marginBottom: '6px' }}>
                  Reallocate +{rec.recommendedResources} Worker(s) from {rec.sourceArea} to {rec.targetArea}
                </div>
                <p className="body-text" style={{ marginBottom: '1rem' }}>
                  {rec.reason}
                </p>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '14px', color: '#555555', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                  <span>Source Area: <strong>{rec.sourceArea}</strong></span>
                  <span>Target Area: <strong>{rec.targetArea}</strong></span>
                  <span>Priority: <strong>{rec.priority}</strong></span>
                  <span>Status: <strong style={{ color: isAccepted ? '#2E7D32' : '#D97706' }}>{rec.status}</strong></span>
                </div>

                {isAccepted ? (
                  <div style={{ padding: '10px 16px', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', borderRadius: '4px', fontWeight: '500', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Recommendation Executed &amp; Reallocated (+{rec.recommendedResources} Sorters)
                  </div>
                ) : (
                  <button
                    className="btn-ups-primary"
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      btn.disabled = true;
                      btn.innerText = 'Applying Reallocation...';
                      try {
                        const res = await api.updateRecommendation(rec._id, 'ACCEPTED');
                        if (res.success) {
                          await fetchDashboardData();
                        }
                      } catch (err) {
                        console.error('Dashboard accept recommendation error:', err);
                        alert(err?.response?.data?.error?.message || 'Failed to accept recommendation');
                      } finally {
                        btn.disabled = false;
                        btn.innerText = 'Accept Recommendation →';
                      }
                    }}
                  >
                    Accept Recommendation →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
