import React, { useState } from 'react';
import { Flag, Settings, Save, Shield } from 'lucide-react';

export default function ModerationSettings() {
  const [settings, setSettings] = useState({
    platformName: 'CareerHub AI',
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxResumeFileSizeMB: 5,
    aiEnabled: true,
    weeklyReportEnabled: true
  });

  return (
    <div className="page-container admin-container">
      <div className="page-header admin-header">
        <div>
          <h2>Content Moderation & System Settings</h2>
          <p>Configure global platform preferences, AI model parameters, and content policies.</p>
        </div>
      </div>

      <div className="admin-settings-card">
        <h3>Platform Preferences</h3>
        <div className="setting-toggle-row">
          <label>Maintenance Mode</label>
          <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
        </div>

        <div className="setting-toggle-row">
          <label>Allow New Student Registrations</label>
          <input type="checkbox" checked={settings.allowNewRegistrations} onChange={e => setSettings({ ...settings, allowNewRegistrations: e.target.checked })} />
        </div>

        <div className="setting-toggle-row">
          <label>Enable Gemini AI Engine</label>
          <input type="checkbox" checked={settings.aiEnabled} onChange={e => setSettings({ ...settings, aiEnabled: e.target.checked })} />
        </div>

        <div className="form-group margin-top-2">
          <label>Maximum Resume Upload Size (MB)</label>
          <input type="number" value={settings.maxResumeFileSizeMB} onChange={e => setSettings({ ...settings, maxResumeFileSizeMB: parseInt(e.target.value) })} />
        </div>

        <button className="btn-primary" onClick={() => alert('System settings saved successfully!')}>
          <Save size={16} /> Save Configuration
        </button>
      </div>
    </div>
  );
}
