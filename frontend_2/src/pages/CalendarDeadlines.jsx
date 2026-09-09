import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

const LOGISTICS_EVENTS = [
  { id: 1, date: '2026-09-12', title: 'Fall Air Gateway Peak Surge (European Feeders)', facility: 'SDF-AIR-01', type: 'Surge', impact: 'High (+18k Pkgs)' },
  { id: 2, date: '2026-09-15', title: 'ORD Sort Belt 2 Automated Sensor Maintenance', facility: 'ORD-SORT-04', type: 'Maintenance', impact: 'Planned 4hr Window' },
  { id: 3, date: '2026-09-20', title: 'Global Linehaul Fleet Inspection Cutoff', facility: 'DFW-DIST-02', type: 'Compliance', impact: 'Mandatory Audit' },
  { id: 4, date: '2026-09-25', title: 'Q4 Cyber Peak Preparation Drill & Staff Simulation', facility: 'ATL-HUB-09', type: 'Simulation', impact: 'Full Shift' }
];

export default function CalendarDeadlines() {
  return (
    <div className="calendar-ops-container">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Operations Calendar & Peak Schedules</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Track peak volume windows, sorter maintenance downtime, air gateway flight cutoffs, and shift dispatch deadlines.
        </p>
      </div>

      <div className="ups-card ups-card-yellow-top">
        <div className="ups-card-header">
          <h3 className="ups-card-title">
            <Calendar size={20} color="#ffb500" /> Upcoming Operations Events
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {LOGISTICS_EVENTS.map(evt => (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.2rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d8d8d8',
                borderLeft: '5px solid #351c15',
                borderRadius: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ padding: '0.6rem 1rem', backgroundColor: '#fffdf5', border: '1px solid #ffb500', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15' }}>{new Date(evt.date).getDate()}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>
                    {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#351c15', marginBottom: '2px' }}>
                    {evt.title}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    Facility: <strong>{evt.facility}</strong> • Impact: <strong>{evt.impact}</strong>
                  </div>
                </div>
              </div>

              <span className="ups-badge badge-yellow">{evt.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
