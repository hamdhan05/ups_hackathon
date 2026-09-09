import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Activity, AlertTriangle, CheckCircle2, RefreshCw, Send, Layers, Users, Clock } from 'lucide-react';

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rerouting, setRerouting] = useState(false);
  const [rerouted, setRerouted] = useState(false);

  const handleReroute = () => {
    setRerouting(true);
    setTimeout(() => {
      setRerouting(false);
      setRerouted(true);
    }, 600);
  };

  return (
    <div className="facility-detail-container">
      <button
        className="btn-ups-outline"
        style={{ marginBottom: '1.5rem', height: '36px' }}
        onClick={() => navigate('/opportunities')}
      >
        <ArrowLeft size={16} /> BACK TO WORKLOAD & CAPACITY
      </button>

      <div className="page-header-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Louisville SDF Worldport Air Hub</h1>
            <div className="heading-accent-line"></div>
            <p className="page-subtitle">
              Facility Code: <strong>SDF-AIR-01</strong> • Category: <strong>Air Hubs</strong> • Location: <strong>Louisville, KY</strong>
            </p>
          </div>
          <span className="ups-badge badge-yellow" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
            CAPACITY WARNING (109%)
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* OPERATIONAL MANIFEST SUMMARY */}
          <div className="ups-card ups-card-yellow-top">
            <div className="ups-card-header">
              <h3 className="ups-card-title">
                <Activity size={20} color="#ffb500" /> Operational Shift Manifest
              </h3>
            </div>
            <p style={{ color: '#444', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              The Louisville SDF Worldport is currently handling high-volume day peak air freight. Sort Belt 2 is operating at 109% sorter capacity due to +12.4% inbound volume spike from European air feeders.
            </p>

            <div className="package-info-grid" style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '0.8rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666' }}>INBOUND AIR FREIGHT</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#351c15' }}>48,200 Pkgs</div>
              </div>
              <div style={{ padding: '0.8rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666' }}>GROUND LINEHAUL</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#351c15' }}>94,300 Pkgs</div>
              </div>
              <div style={{ padding: '0.8rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666' }}>SORT BELT CAPACITY</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#d97706' }}>109% Utilization</div>
              </div>
              <div style={{ padding: '0.8rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666' }}>SHIFT DEFICIT</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#c62828' }}>+14 Staff Gap</div>
              </div>
            </div>
          </div>

          {/* SORT MATRIX & DOCK DOOR STATUS */}
          <div className="ups-card ups-card-accent-top">
            <div className="ups-card-header">
              <h3 className="ups-card-title">Dock Door & Sort Belt Matrix</h3>
            </div>
            <div className="ups-table-container">
              <table className="ups-table">
                <thead>
                  <tr>
                    <th>Sort Matrix Zone</th>
                    <th>Throughput Target</th>
                    <th>Actual Flow</th>
                    <th>Status</th>
                    <th>Staffing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Zone A • Belt 1 (Express Air)</strong></td>
                    <td>35,000 / hr</td>
                    <td>32,400 / hr</td>
                    <td><span className="ups-badge badge-green">OPTIMIZED</span></td>
                    <td>42 / 42 Sorters</td>
                  </tr>
                  <tr>
                    <td><strong>Zone B • Belt 2 (Ground Feeders)</strong></td>
                    <td>45,000 / hr</td>
                    <td>49,100 / hr</td>
                    <td><span className="ups-badge badge-yellow">OVERLOAD</span></td>
                    <td>38 / 52 Sorters (-14)</td>
                  </tr>
                  <tr>
                    <td><strong>Zone C • Belt 3 (Customs Hold)</strong></td>
                    <td>20,000 / hr</td>
                    <td>18,200 / hr</td>
                    <td><span className="ups-badge badge-green">OPTIMIZED</span></td>
                    <td>25 / 25 Sorters</td>
                  </tr>
                  <tr>
                    <td><strong>Zone D • Belt 4 (Overnight Expedited)</strong></td>
                    <td>40,000 / hr</td>
                    <td>42,800 / hr</td>
                    <td><span className="ups-badge badge-blue">NEAR PEAK</span></td>
                    <td>48 / 50 Sorters</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="ups-card ups-card-yellow-top">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#351c15', marginBottom: '8px' }}>
              AI Reroute Recommendation
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '1.2rem' }}>
              Reassign 12,500 packages from Belt 2 to SDF-East Gateway to normalize sort throughput.
            </p>

            {rerouted ? (
              <div style={{ padding: '0.8rem', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', color: '#2e7d32', borderRadius: '4px', fontWeight: '700', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> Reroute Command Executed!
              </div>
            ) : (
              <button
                className="btn-ups-primary"
                style={{ width: '100%' }}
                onClick={handleReroute}
                disabled={rerouting}
              >
                {rerouting ? <RefreshCw size={18} className="animate-spin" /> : 'EXECUTE AI REROUTE NOW'}
              </button>
            )}

            <button
              className="btn-ups-secondary"
              style={{ width: '100%', marginTop: '0.8rem' }}
              onClick={() => navigate('/ai-career-suite')}
            >
              OPEN WORKFORCE AI ENGINE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
