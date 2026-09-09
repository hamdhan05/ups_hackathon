import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Layers, Users, Activity, AlertTriangle, RefreshCw, Send, CheckCircle2, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function AIServices() {
  const { user, selectedFacility } = useAuth();
  const [activeTab, setActiveTab] = useState('labor');

  // Workforce Calculator state
  const [parcelVolume, setParcelVolume] = useState('142500');
  const [shiftHours, setShiftHours] = useState('12');
  const [calculatedLabor, setCalculatedLabor] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Package Rerouting AI state
  const [overloadBelt, setOverloadBelt] = useState('Sort Belt 2 (Ground Feeders)');
  const [targetHub, setTargetHub] = useState('SDF-East Gateway Depot');
  const [reroutePlan, setReroutePlan] = useState(null);

  const handleCalculateLabor = (e) => {
    e.preventDefault();
    setCalculating(true);
    setTimeout(() => {
      const vol = parseInt(parcelVolume) || 142500;
      const hrs = parseInt(shiftHours) || 12;
      const ratePerHour = vol / hrs;
      const reqSorters = Math.ceil(ratePerHour / 600); // 600 pkgs/hr/sorter benchmark
      setCalculatedLabor({
        requiredSorters: reqSorters,
        activeSorters: 186,
        deficit: Math.max(0, reqSorters - 186),
        utilizationRate: Math.round((vol / 130000) * 100),
        recommendedAction: reqSorters > 186 ? `Dispatch +${reqSorters - 186} flex sorters from Ground Depot B.` : 'Labor allocation fully optimal.'
      });
      setCalculating(false);
    }, 400);
  };

  const handleGenerateReroute = (e) => {
    e.preventDefault();
    setReroutePlan({
      divertedVolume: '12,500 Packages',
      sourceFacility: selectedFacility || 'SDF-AIR-01',
      targetFacility: targetHub,
      timeSavings: '34 Minutes / Feeder Trailer',
      beltLoadAfter: '94% (Normalized)',
      execStatus: 'READY FOR DISPATCH'
    });
  };

  return (
    <div className="workforce-ai-container">
      {/* PAGE HEADER WITH SIGNATURE UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Workforce AI & Capacity Intelligence Engine</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          AI-driven labor allocation, sorter throughput optimization, shift deficit forecasting, and automated parcel rerouting.
        </p>
      </div>

      {/* NAVIGATION TABS (UPS STYLE) */}
      <div className="ups-card ups-card-yellow-top" style={{ padding: '0.8rem 1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            className={activeTab === 'labor' ? 'btn-ups-primary' : 'btn-ups-outline'}
            style={{ height: '40px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('labor')}
          >
            <Users size={16} /> WORKFORCE ALLOCATION CALCULATOR
          </button>
          <button
            className={activeTab === 'reroute' ? 'btn-ups-primary' : 'btn-ups-outline'}
            style={{ height: '40px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('reroute')}
          >
            <Layers size={16} /> AUTOMATED PARCEL REROUTER
          </button>
          <button
            className={activeTab === 'bottleneck' ? 'btn-ups-primary' : 'btn-ups-outline'}
            style={{ height: '40px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('bottleneck')}
          >
            <AlertTriangle size={16} /> PREDICTIVE BOTTLENECK ENGINE
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: WORKFORCE CALCULATOR */}
      {activeTab === 'labor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="ups-card ups-card-accent-top">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#ffb500" /> Shift Capacity Parameters
            </h3>

            <form onSubmit={handleCalculateLabor} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="filter-field-group">
                <label>Expected Shift Parcel Volume (Units)</label>
                <input
                  type="number"
                  className="ups-input"
                  value={parcelVolume}
                  onChange={e => setParcelVolume(e.target.value)}
                />
              </div>

              <div className="filter-field-group">
                <label>Shift Operating Window (Hours)</label>
                <select className="ups-select" value={shiftHours} onChange={e => setShiftHours(e.target.value)}>
                  <option value="8">8 Hours (Standard Shift)</option>
                  <option value="12">12 Hours (Peak Day Operation)</option>
                  <option value="24">24 Hours (Full Facility Cycle)</option>
                </select>
              </div>

              <button type="submit" className="btn-ups-primary" disabled={calculating}>
                {calculating ? <RefreshCw size={18} className="animate-spin" /> : 'CALCULATE WORKFORCE REQUIREMENTS'}
              </button>
            </form>
          </div>

          <div className="ups-card ups-card-yellow-top">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem' }}>
              AI Workforce Recommendation
            </h3>

            {calculatedLabor ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="package-info-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0' }}>
                  <div style={{ padding: '0.8rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666' }}>REQUIRED SORTERS</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#351c15' }}>{calculatedLabor.requiredSorters} Staff</div>
                  </div>

                  <div style={{ padding: '0.8rem', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666' }}>SHIFT HEADCOUNT GAP</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: calculatedLabor.deficit > 0 ? '#c62828' : '#2e7d32' }}>
                      {calculatedLabor.deficit > 0 ? `+${calculatedLabor.deficit} Deficit` : 'Optimal'}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#fffdf5', border: '1px solid #ffe082', borderRadius: '4px', borderLeft: '4px solid #ffb500' }}>
                  <strong style={{ color: '#351c15', fontSize: '0.9rem' }}>💡 AI Dispatch Action:</strong>
                  <p style={{ fontSize: '0.88rem', color: '#444', marginTop: '4px' }}>{calculatedLabor.recommendedAction}</p>
                </div>

                <button className="btn-ups-secondary">DISPATCH FLEX LABOR CREW</button>
              </div>
            ) : (
              <div style={{ color: '#666', fontSize: '0.9rem', padding: '2rem 0', textAlign: 'center' }}>
                Enter shift volume parameters and click calculate to generate AI workforce allocation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PARCEL REROUTER */}
      {activeTab === 'reroute' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="ups-card ups-card-accent-top">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#ffb500" /> Reroute Matrix Configuration
            </h3>

            <form onSubmit={handleGenerateReroute} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="filter-field-group">
                <label>Overloaded Sort Belt</label>
                <select className="ups-select" value={overloadBelt} onChange={e => setOverloadBelt(e.target.value)}>
                  <option value="Belt 2">Sort Belt 2 (Ground Feeders - 109% Load)</option>
                  <option value="Belt 4">Sort Belt 4 (Overnight Expedited - 98% Load)</option>
                </select>
              </div>

              <div className="filter-field-group">
                <label>Target Reroute Gateway</label>
                <select className="ups-select" value={targetHub} onChange={e => setTargetHub(e.target.value)}>
                  <option value="SDF-East Gateway Depot">SDF-East Gateway Depot (Louisville, KY)</option>
                  <option value="IND-HUB-02">Indianapolis Hub Feeder (IND-HUB-02)</option>
                  <option value="CVG-AIR-03">Cincinnati CVG Sorting Gateway (CVG-AIR-03)</option>
                </select>
              </div>

              <button type="submit" className="btn-ups-primary">GENERATE REROUTE MANIFEST</button>
            </form>
          </div>

          <div className="ups-card ups-card-yellow-top">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem' }}>
              Simulated Flow Optimization
            </h3>

            {reroutePlan ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f6fbf6', border: '1px solid #c8e6c9', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#2e7d32', textTransform: 'uppercase' }}>DIVERTED VOLUME</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#351c15' }}>{reroutePlan.divertedVolume}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Target: {reroutePlan.targetFacility}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '6px' }}>
                  <span style={{ color: '#666' }}>Feeder Dwell Savings:</span>
                  <span style={{ fontWeight: '900', color: '#351c15' }}>{reroutePlan.timeSavings}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '6px' }}>
                  <span style={{ color: '#666' }}>Belt Load After Reroute:</span>
                  <span style={{ fontWeight: '900', color: '#2e7d32' }}>{reroutePlan.beltLoadAfter}</span>
                </div>

                <button className="btn-ups-primary" style={{ width: '100%', marginTop: '8px' }}>
                  EXECUTE INTER-HUB DISPATCH
                </button>
              </div>
            ) : (
              <div style={{ color: '#666', fontSize: '0.9rem', padding: '2rem 0', textAlign: 'center' }}>
                Configure reroute parameters and click generate to optimize belt throughput.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: BOTTLENECK ENGINE */}
      {activeTab === 'bottleneck' && (
        <div className="ups-card ups-card-yellow-top">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#d97706" /> Predictive Bottleneck Risk Analysis
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
            AI neural monitoring of scanner throughput rate, dock door dwell times, and belt velocity across LogiPulse network.
          </p>

          <div className="ups-table-container">
            <table className="ups-table">
              <thead>
                <tr>
                  <th>Facility Node</th>
                  <th>Observed Metric</th>
                  <th>AI Predicted Risk</th>
                  <th>Time Horizon</th>
                  <th>Recommended Mitigation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>SDF-AIR-01 (Louisville)</strong></td>
                  <td>Sort Belt 2 @ 109%</td>
                  <td><span className="ups-badge badge-yellow">HIGH BOTTLENECK</span></td>
                  <td>Next 45 Mins</td>
                  <td>Reroute 12.5k pkgs to SDF-East</td>
                </tr>
                <tr>
                  <td><strong>ORD-SORT-04 (Chicago)</strong></td>
                  <td>Dock Door 14 Dwell 28m</td>
                  <td><span className="ups-badge badge-blue">MODERATE DELAY</span></td>
                  <td>Next 2 Hours</td>
                  <td>Re-assign 2 flex un-loaders</td>
                </tr>
                <tr>
                  <td><strong>DFW-DIST-02 (Dallas)</strong></td>
                  <td>Linehaul Trailer Queue 12</td>
                  <td><span className="ups-badge badge-green">LOW RISK</span></td>
                  <td>On Schedule</td>
                  <td>Maintain current shift cycle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
