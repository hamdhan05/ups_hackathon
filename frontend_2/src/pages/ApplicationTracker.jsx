import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Calendar, RefreshCw, Trash2, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

const BOTTLENECK_STAGES = [
  'Inbound Air Sort',
  'Automated Matrix Belts',
  'Dock Staging & Loading',
  'Outbound Linehaul',
  'Resolved / Optimal'
];

const INITIAL_BOTTLENECKS = [
  {
    _id: 'bt_1',
    title: 'Sort Belt 2 Capacity Surge (+9%)',
    facility: 'Louisville SDF Worldport',
    code: 'SDF-AIR-01',
    stage: 'Automated Matrix Belts',
    severity: 'High',
    impact: '12,500 Pkgs Affected',
    assignedStaff: 'Ops Supervisor Miller'
  },
  {
    _id: 'bt_2',
    title: 'Dock Door 14-18 Unload Delay',
    facility: 'Chicago ORD Sort Center',
    code: 'ORD-SORT-04',
    stage: 'Dock Staging & Loading',
    severity: 'Medium',
    impact: '6 Feeder Trailers Dwell',
    assignedStaff: 'Supervisor Henderson'
  },
  {
    _id: 'bt_3',
    title: 'Flight Feeder 802 Air Clearance Hold',
    facility: 'Louisville SDF Worldport',
    code: 'SDF-AIR-01',
    stage: 'Inbound Air Sort',
    severity: 'Medium',
    impact: 'Customs Manifest Verification',
    assignedStaff: 'Agent R. Martinez'
  },
  {
    _id: 'bt_4',
    title: 'Linehaul Dispatch Gate 4 Maintenance',
    facility: 'Dallas DFW Logistics Park',
    code: 'DFW-DIST-02',
    stage: 'Outbound Linehaul',
    severity: 'Low',
    impact: 'Rerouted to Gate 8',
    assignedStaff: 'Fleet Coordinator Chen'
  },
  {
    _id: 'bt_5',
    title: 'Zone C Container Staging Clear',
    facility: 'Atlanta ATL Hub',
    code: 'ATL-HUB-09',
    stage: 'Resolved / Optimal',
    severity: 'Low',
    impact: '0 Delay',
    assignedStaff: 'Shift Lead Davis'
  }
];

export default function ApplicationTracker() {
  const [bottlenecks, setBottlenecks] = useState(INITIAL_BOTTLENECKS);

  const moveStage = (id, newStage) => {
    setBottlenecks(prev => prev.map(b => b._id === id ? { ...b, stage: newStage } : b));
  };

  const removeBottleneck = (id) => {
    setBottlenecks(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="bottlenecks-tracker-container">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Operational Bottleneck & Alert Tracker</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Real-time Kanban matrix tracking facility bottlenecks, shift exceptions, trailer dwell delays, and resolution workflows.
        </p>
      </div>

      {/* STAGE BOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {BOTTLENECK_STAGES.map(stage => {
          const stageItems = bottlenecks.filter(b => b.stage === stage);
          return (
            <div
              key={stage}
              className="ups-card ups-card-accent-top"
              style={{ backgroundColor: '#ffffff', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', minHeight: '500px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #351c15', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#351c15', textTransform: 'uppercase' }}>
                  {stage}
                </span>
                <span className="ups-badge badge-blue">{stageItems.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                {stageItems.map(item => {
                  const isHigh = item.severity === 'High';
                  return (
                    <div
                      key={item._id}
                      style={{
                        backgroundColor: isHigh ? '#fffdf5' : '#fafafa',
                        border: '1px solid #d8d8d8',
                        borderLeft: `4px solid ${isHigh ? '#d97706' : stage === 'Resolved / Optimal' ? '#2e7d32' : '#0066cc'}`,
                        borderRadius: '4px',
                        padding: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#666' }}>{item.code}</span>
                        <button
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                          onClick={() => removeBottleneck(item._id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '0.9rem', fontWeight: '900', color: '#351c15', marginBottom: '4px' }}>
                        {item.title}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#666', marginBottom: '8px' }}>
                        {item.impact}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {BOTTLENECK_STAGES.filter(s => s !== stage).slice(0, 2).map(nextStage => (
                          <button
                            key={nextStage}
                            className="btn-ups-outline"
                            style={{ height: '24px', fontSize: '0.7rem', padding: '0 6px' }}
                            onClick={() => moveStage(item._id, nextStage)}
                          >
                            → {nextStage.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
