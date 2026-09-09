import React from 'react';
import { Trophy, Award, CheckCircle2, Building2 } from 'lucide-react';

const HUB_RANKINGS = [
  { rank: 1, name: 'Louisville SDF Worldport Air Hub', code: 'SDF-AIR-01', score: '99.4%', volume: '142,500 Pkgs/Day', badge: 'GOLD THROUGHPUT' },
  { rank: 2, name: 'Atlanta ATL Gateway & Depots', code: 'ATL-HUB-09', score: '98.8%', volume: '135,000 Pkgs/Day', badge: 'SILVER THROUGHPUT' },
  { rank: 3, name: 'Chicago ORD Regional Sort Facility', code: 'ORD-SORT-04', score: '97.2%', volume: '118,000 Pkgs/Day', badge: 'BRONZE THROUGHPUT' },
  { rank: 4, name: 'Dallas DFW Global Logistics Park', code: 'DFW-DIST-02', score: '96.5%', volume: '95,000 Pkgs/Day', badge: 'TOP REGIONAL' }
];

export default function CodingGamification() {
  return (
    <div className="leaderboard-container">
      {/* PAGE HEADER WITH UPS YELLOW ACCENT UNDERLINE */}
      <div className="page-header-block">
        <h1 className="page-title">Hub Throughput & Sort Efficiency Leaderboard</h1>
        <div className="heading-accent-line"></div>
        <p className="page-subtitle">
          Real-time network efficiency scores, scan accuracy rankings, and hub throughput excellence awards across LogiPulse.
        </p>
      </div>

      <div className="ups-card ups-card-yellow-top">
        <div className="ups-card-header">
          <h3 className="ups-card-title">
            <Trophy size={20} color="#ffb500" /> LogiPulse Facility Efficiency Rankings
          </h3>
        </div>

        <div className="ups-table-container">
          <table className="ups-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Facility Name</th>
                <th>Facility Code</th>
                <th>Scan Accuracy Score</th>
                <th>Daily Parcel Volume</th>
                <th>Excellence Award</th>
              </tr>
            </thead>
            <tbody>
              {HUB_RANKINGS.map(hub => (
                <tr key={hub.code}>
                  <td><strong>#{hub.rank}</strong></td>
                  <td><strong>{hub.name}</strong></td>
                  <td>{hub.code}</td>
                  <td><span className="ups-badge badge-green">{hub.score}</span></td>
                  <td>{hub.volume}</td>
                  <td><span className="ups-badge badge-yellow">{hub.badge}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
