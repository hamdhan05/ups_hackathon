import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function OperationsPage() {
  const { selectedFacility } = useAuth();
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterArea, setFilterArea] = useState('');

  useEffect(() => {
    async function fetchOps() {
      setLoading(true);
      try {
        const params = {};
        if (filterType) params.operationType = filterType;
        if (filterArea) params.operationalArea = filterArea;
        const res = await api.getOperations(params);
        if (res.success) {
          setOperations(res.data.items || []);
        }
      } catch (err) {
        console.error('Operations fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOps();
  }, [filterType, filterArea]);

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'AT_RISK':
        return 'badge-yellow';
      case 'DELAYED':
        return 'badge-blue';
      case 'COMPLETED':
      case 'NORMAL':
        return 'badge-green';
      default:
        return 'badge-green';
    }
  };

  return (
    <div className="operations-page">
      <div className="page-header-block">
        <h1 className="page-title">Operations</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Live sorting facility matrix, air gateway manifests, and operational throughput logs for {selectedFacility}.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="ups-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Filter Operation Type
            </label>
            <select className="ups-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All Types (INBOUND, OUTBOUND, INVENTORY)</option>
              <option value="INBOUND">INBOUND</option>
              <option value="OUTBOUND">OUTBOUND</option>
              <option value="INVENTORY">INVENTORY</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Filter Operational Area
            </label>
            <select className="ups-select" value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
              <option value="">All Operational Areas</option>
              <option value="Receiving">Receiving</option>
              <option value="Putaway">Putaway</option>
              <option value="Picking">Picking</option>
              <option value="Packing">Packing</option>
              <option value="Shipping">Shipping</option>
              <option value="Inventory">Inventory</option>
            </select>
          </div>
        </div>
      </div>

      {/* OPERATIONS TABLE */}
      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Operational Telemetry Matrix ({operations.length} Records)</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading operations data...</div>
        ) : (
          <div className="ups-table-container">
            <table className="ups-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Operational Area</th>
                  <th>Type</th>
                  <th>Workload</th>
                  <th>Completed / Planned</th>
                  <th>Efficiency</th>
                  <th>Utilization</th>
                  <th>Staffing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {operations.slice(0, 30).map((op) => (
                  <tr key={op._id}>
                    <td>{new Date(op.date).toISOString().split('T')[0]}</td>
                    <td style={{ fontWeight: '600', color: '#330000' }}>{op.operationalArea}</td>
                    <td>{op.operationType}</td>
                    <td style={{ fontFamily: 'monospace' }}>{op.workload?.toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>
                      {op.completedWorkload?.toLocaleString()} / {op.plannedWorkload?.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '600', color: '#2F855A' }}>{op.efficiency}%</td>
                    <td style={{ fontWeight: '600' }}>{op.utilization}%</td>
                    <td>{op.availableWorkforce} Sorters</td>
                    <td>
                      <span className={`ups-badge ${getBadgeStyle(op.status)}`}>{op.status}</span>
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
