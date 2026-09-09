import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function BottlenecksPage() {
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBottlenecks() {
      try {
        const res = await api.getBottlenecks();
        if (res.success) {
          setBottlenecks(res.data.items || []);
        }
      } catch (err) {
        console.error('Bottlenecks fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBottlenecks();
  }, []);

  const getBadgeStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'badge-yellow';
      case 'MEDIUM':
        return 'badge-blue';
      default:
        return 'badge-green';
    }
  };

  return (
    <div className="bottlenecks-page">
      <div className="page-header-block">
        <h1 className="page-title">Bottlenecks</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Real-time operational bottleneck tracking matrix, shift exception logs, and severity alerts.
        </p>
      </div>

      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Active Bottlenecks &amp; Shift Exceptions ({bottlenecks.length} Events)</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading bottlenecks...</div>
        ) : bottlenecks.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#2F855A', fontWeight: '500' }}>
            ✓ No active bottlenecks detected across any operational area.
          </div>
        ) : (
          <div className="ups-table-container">
            <table className="ups-table">
              <thead>
                <tr>
                  <th>Operational Area</th>
                  <th>Type</th>
                  <th>Workload Volume</th>
                  <th>Required / Available</th>
                  <th>Capacity Gap</th>
                  <th>Utilization</th>
                  <th>Severity</th>
                  <th>Reason / Cause</th>
                </tr>
              </thead>
              <tbody>
                {bottlenecks.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: '600', color: '#330000' }}>{item.operationalArea}</td>
                    <td>{item.operationType}</td>
                    <td style={{ fontFamily: 'monospace' }}>{item.workload?.toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>
                      <span style={{ color: '#C53030', fontWeight: '600' }}>{item.requiredWorkforce}</span> /{' '}
                      <span style={{ color: '#2F855A', fontWeight: '600' }}>{item.availableWorkforce}</span>
                    </td>
                    <td style={{ fontWeight: '700', color: '#C53030' }}>{item.capacityGap}</td>
                    <td style={{ fontWeight: '600' }}>{item.utilization}%</td>
                    <td>
                      <span className={`ups-badge ${getBadgeStyle(item.severity)}`}>{item.severity}</span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#4A5568', maxWidth: '280px' }}>{item.reason}</td>
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
