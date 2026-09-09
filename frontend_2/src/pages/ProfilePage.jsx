import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Building2, ShieldCheck, Save, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Marcus Vance',
    email: user?.email || 'm.vance@logipulse-global.com',
    title: user?.title || 'Senior Operations Manager',
    facility: user?.facility || 'Louisville SDF Worldport Air Hub',
    facilityCode: user?.facilityCode || 'SDF-AIR-01',
    activeShift: user?.activeShift || 'Day Peak (06:00 - 18:00)'
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    alert('Logistics Manager Preferences updated successfully!');
  };

  return (
    <div className="manager-settings-container">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Logistics Manager Settings & Hub Preferences</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Manage operational credentials, primary assigned hub nodes, notification alert thresholds, and active shift parameters.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* MANAGER PROFILE CARD */}
        <div className="ups-card ups-card-yellow-top">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#351c15',
                color: '#ffb500',
                fontSize: '1.8rem',
                fontWeight: '900',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}
            >
              {user?.name?.[0] || 'M'}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#351c15' }}>{formData.name}</h3>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>{formData.title}</div>
            <span className="ups-badge badge-green" style={{ marginTop: '8px' }}>
              AUTHENTICATED MANAGER
            </span>
          </div>

          <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '1rem', fontSize: '0.85rem', color: '#444' }}>
            <div style={{ marginBottom: '6px' }}><strong>Primary Facility:</strong> {formData.facility}</div>
            <div style={{ marginBottom: '6px' }}><strong>Facility Code:</strong> {formData.facilityCode}</div>
            <div><strong>Active Shift:</strong> {formData.activeShift}</div>
          </div>
        </div>

        {/* SETTINGS FORM */}
        <div className="ups-card ups-card-accent-top">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#351c15', marginBottom: '1rem' }}>
            Manager Operational Configuration
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="filter-field-group">
                <label>Manager Name</label>
                <input
                  type="text"
                  className="ups-input"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="filter-field-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="ups-input"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="filter-field-group">
                <label>Assigned Air Hub / Facility</label>
                <input
                  type="text"
                  className="ups-input"
                  value={formData.facility}
                  onChange={e => setFormData({ ...formData, facility: e.target.value })}
                />
              </div>

              <div className="filter-field-group">
                <label>Facility Code</label>
                <input
                  type="text"
                  className="ups-input"
                  value={formData.facilityCode}
                  onChange={e => setFormData({ ...formData, facilityCode: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-ups-primary">
              <Save size={16} /> SAVE PREFERENCES
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
