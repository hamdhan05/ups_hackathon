import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Building2, Users, AlertTriangle, ArrowRight, Layers, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-command-center">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Global Network Control Center</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Global logistics network monitoring, facility node governance, shift throughput metrics, and automated alert configuration.
        </p>
      </div>

      {/* GLOBAL METRICS GRID */}
      <div className="package-info-grid">
        <div className="info-card yellow-accent">
          <div className="info-card-label">Network Parcel Flow</div>
          <div className="info-card-value">1,485,000</div>
          <div className="info-card-sub">Packages Processed Globally Today</div>
        </div>

        <div className="info-card">
          <div className="info-card-label">Active Logistics Hubs</div>
          <div className="info-card-value">24 Hubs</div>
          <div className="info-card-sub">Air Gateways & Sort Depots</div>
        </div>

        <div className="info-card yellow-accent">
          <div className="info-card-label">Global Shift Workforce</div>
          <div className="info-card-value">14,250</div>
          <div className="info-card-sub">Active Duty Sorters & Drivers</div>
        </div>

        <div className="info-card">
          <div className="info-card-label">Network Health Rating</div>
          <div className="info-card-value">98.4%</div>
          <div className="info-card-sub">Optimal Flow Efficiency</div>
        </div>
      </div>

      {/* GOVERNANCE MODULES */}
      <div className="ups-card ups-card-yellow-top">
        <div className="ups-card-header">
          <h3 className="ups-card-title">
            <Shield size={20} color="#ffb500" /> Global Network Administration Modules
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
          <div
            style={{ padding: '1.2rem', backgroundColor: '#ffffff', border: '1px solid #d8d8d8', borderLeft: '4px solid #351c15', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/students')}
          >
            <Users size={24} color="#351c15" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#351c15', marginBottom: '4px' }}>Facility Staffing & Roster</h4>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>Manage manager rosters, sorter headcount allocations, and shift schedules.</p>
          </div>

          <div
            style={{ padding: '1.2rem', backgroundColor: '#ffffff', border: '1px solid #d8d8d8', borderLeft: '4px solid #ffb500', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/opportunities')}
          >
            <Building2 size={24} color="#ffb500" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#351c15', marginBottom: '4px' }}>Hub Operations Configuration</h4>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>Configure sorting facility throughput targets and belt capacities.</p>
          </div>

          <div
            style={{ padding: '1.2rem', backgroundColor: '#ffffff', border: '1px solid #d8d8d8', borderLeft: '4px solid #351c15', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/analytics')}
          >
            <BarChart3 size={24} color="#0066cc" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#351c15', marginBottom: '4px' }}>Network Analytics & Reports</h4>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>Generate daily parcel throughput, dwell time, and cost efficiency reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
