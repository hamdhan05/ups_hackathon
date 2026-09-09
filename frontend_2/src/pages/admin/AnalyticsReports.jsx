import React from 'react';
import { BarChart3, TrendingUp, Users, Download } from 'lucide-react';

export default function AnalyticsReports() {
  return (
    <div className="page-container admin-container">
      <div className="page-header admin-header">
        <div>
          <h2>Campus Placement Reports & Analytics</h2>
          <p>Comprehensive placement analytics, AI feature adoption metrics, and exportable reports.</p>
        </div>
        <button className="btn-secondary" onClick={() => alert('Exporting Campus Placement Analytics Report (PDF / CSV)...')}>
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      <div className="analytics-summary-cards">
        <div className="analytics-card">
          <h4>Placements by Branch</h4>
          <ul className="stats-breakdown-list">
            <li><strong>CSE:</strong> 142 Students Placed (91%)</li>
            <li><strong>IT:</strong> 98 Students Placed (86%)</li>
            <li><strong>ECE:</strong> 72 Students Placed (74%)</li>
          </ul>
        </div>

        <div className="analytics-card">
          <h4>AI Feature Usage Breakdown</h4>
          <ul className="stats-breakdown-list">
            <li><strong>Resume ATS Analysis:</strong> 1,420 runs</li>
            <li><strong>Resume vs JD Matcher:</strong> 890 runs</li>
            <li><strong>Skill Gap Analysis:</strong> 640 runs</li>
            <li><strong>AI Cover Letter Generator:</strong> 520 runs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
