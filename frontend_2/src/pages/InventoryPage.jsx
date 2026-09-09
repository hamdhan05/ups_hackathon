import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function InventoryPage() {
  const [inventoryOps, setInventoryOps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await api.getOperations({ operationType: 'INVENTORY' });
        if (res.success) {
          setInventoryOps(res.data.items || []);
        }
      } catch (err) {
        console.error('Inventory fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const totalVolume = inventoryOps.reduce((acc, op) => acc + (op.workload || 0), 0);
  const avgEfficiency = inventoryOps.length
    ? Math.round(inventoryOps.reduce((acc, op) => acc + (op.efficiency || 0), 0) / inventoryOps.length)
    : 0;

  return (
    <div className="inventory-page">
      <div className="page-header-block">
        <h1 className="page-title">Inventory Staging</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Inventory staging volume logs, warehouse buffer utilization, and stock holding telemetry.
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total Inventory Volume (30 Days)</div>
          <div className="kpi-number">{totalVolume.toLocaleString()}</div>
          <div className="kpi-unit">staged package units</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Average Inventory Efficiency</div>
          <div className="kpi-number">{avgEfficiency}%</div>
          <div className="kpi-unit">staging throughput efficiency rating</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Inventory Status</div>
          <div className="kpi-number">Optimal</div>
          <div className="kpi-unit">warehouse buffer within safe operating thresholds</div>
        </div>
      </div>

      <div className="ups-card">
        <div className="ups-card-header">
          <h2 className="card-heading">Inventory Staging Telemetry Log ({inventoryOps.length} Records)</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading inventory telemetry...</div>
        ) : (
          <div className="ups-table-container">
            <table className="ups-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Operational Area</th>
                  <th>Type</th>
                  <th>Staged Volume</th>
                  <th>Capacity</th>
                  <th>Efficiency</th>
                  <th>Utilization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryOps.slice(0, 30).map((op) => (
                  <tr key={op._id}>
                    <td>{new Date(op.date).toISOString().split('T')[0]}</td>
                    <td style={{ fontWeight: '600', color: '#330000' }}>{op.operationalArea}</td>
                    <td>{op.operationType}</td>
                    <td style={{ fontFamily: 'monospace' }}>{op.workload?.toLocaleString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>{op.processingCapacity?.toLocaleString()}</td>
                    <td style={{ fontWeight: '600', color: '#2F855A' }}>{op.efficiency}%</td>
                    <td style={{ fontWeight: '600' }}>{op.utilization}%</td>
                    <td>
                      <span className="ups-badge badge-green">{op.status}</span>
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
