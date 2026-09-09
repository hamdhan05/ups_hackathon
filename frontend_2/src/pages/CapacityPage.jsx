import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
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

export default function CapacityPage() {
  const [capacity, setCapacity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCapacity() {
      try {
        const res = await api.getCapacity();
        if (res.success) {
          setCapacity(res.data.items || []);
        }
      } catch (err) {
        console.error('Capacity fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCapacity();
  }, []);

  const totalRequired = capacity.reduce((acc, c) => acc + (c.requiredWorkforce || 0), 0);
  const totalAvailable = capacity.reduce((acc, c) => acc + (c.availableWorkforce || 0), 0);
  const totalGap = totalAvailable - totalRequired;
  const avgUtil = capacity.length
    ? Math.round(capacity.reduce((acc, c) => acc + (c.utilization || 0), 0) / capacity.length)
    : 0;

  const chartData = capacity.map((c) => ({
    name: c.operationalArea,
    Required: c.requiredWorkforce,
    Available: c.availableWorkforce,
  }));

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'UNDER_CAPACITY':
      case 'CRITICAL':
      case 'HIGH':
        return 'badge-yellow';
      case 'OVER_CAPACITY':
      case 'BALANCED':
      case 'NORMAL':
        return 'badge-green';
      default:
        return 'badge-blue';
    }
  };

  return (
    <div className="capacity-page">
      <div className="page-header-block">
        <h1 className="page-title">Capacity</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Sorter throughput capacity utilization, belt load analysis, and processing threshold monitoring.
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total Required Workforce</div>
          <div className="kpi-number">{totalRequired}</div>
          <div className="kpi-unit">sorters required across all 6 areas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total Available Workforce</div>
          <div className="kpi-number">{totalAvailable}</div>
          <div className="kpi-unit">
            active sorters on shift ({totalGap < 0 ? `${totalGap} deficit` : `+${totalGap} surplus`})
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Average Utilization Load</div>
          <div className="kpi-number">{avgUtil}%</div>
          <div className="kpi-unit">facility-wide processing capacity load</div>
        </div>
      </div>

      {/* WORKFORCE CHART */}
      <div className="ups-card" style={{ marginBottom: '2rem' }}>
        <div className="ups-card-header">
          <h2 className="card-heading">Required vs Available Workforce Comparison</h2>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#FAF9F8', borderColor: '#D9D7D3', color: '#330000' }} />
              <Legend wrapperStyle={{ color: '#330000' }} />
              <Bar dataKey="Required" fill="#351C15" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Available" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CAPACITY BREAKDOWN TABLE */}
      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Workforce Capacity Status Breakdown</h2>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading capacity data...</div>
        ) : (
          <div className="ups-table-container">
            <table className="ups-table">
              <thead>
                <tr>
                  <th>Operational Area</th>
                  <th>Type</th>
                  <th>Forecast Workload</th>
                  <th>Required Sorters</th>
                  <th>Available Sorters</th>
                  <th>Capacity Gap</th>
                  <th>Utilization</th>
                  <th>Status</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {capacity.map((cap) => (
                  <tr key={cap._id}>
                    <td style={{ fontWeight: '600', color: '#330000' }}>{cap.operationalArea}</td>
                    <td>{cap.operationType}</td>
                    <td style={{ fontFamily: 'monospace' }}>{cap.forecastWorkload?.toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace', color: '#C53030', fontWeight: '600' }}>
                      {cap.requiredWorkforce}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#2F855A', fontWeight: '600' }}>
                      {cap.availableWorkforce}
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
                    <td>
                      <span className={`ups-badge ${getBadgeStyle(cap.riskLevel)}`}>{cap.riskLevel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
