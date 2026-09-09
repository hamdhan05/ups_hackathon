import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Building2, User } from 'lucide-react';

export default function Navbar() {
  const { user, selectedFacility, setSelectedFacility } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="main-header-wrapper">
      {/* TIER 1: TOP ANNOUNCEMENT STRIP */}
      <div className="top-announcement-wrapper">
        <div className="top-announcement-bar">
          <div className="announcement-left">
            <div className="announcement-brand-tag">
              <Activity size={15} color="#330000" />
              <span>LOGIPULSE OPERATIONAL NETWORK</span>
            </div>

            <div className="facility-selector-box">
              <Building2 size={13} color="#330000" />
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                <option value="SDF-AIR-01">Louisville SDF Worldport Air Hub</option>
                <option value="ORD-SORT-04">Chicago ORD Regional Sort Facility</option>
                <option value="DFW-DIST-02">Dallas DFW Global Logistics Park</option>
                <option value="ATL-HUB-09">Atlanta ATL Gateway & Depots</option>
              </select>
            </div>
          </div>

          <div className="announcement-right">
            <span>NETWORK HEALTH: 98.4% NORMAL</span>
          </div>
        </div>
      </div>

      {/* TIER 2: MAIN NAVIGATION HEADER */}
      <div className="main-header">
        <div className="header-container">
          {/* Logo & Brand */}
          <div className="logo-brand" onClick={() => navigate('/dashboard')}>
            <div className="logipulse-shield">
              <Activity size={24} color="#FFC400" />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">LOGIPULSE</span>
              <span className="brand-subtext">PARCEL & LOGISTICS INTELLIGENCE</span>
            </div>
          </div>

          {/* Horizontal Navigation Links */}
          <nav className="nav-links-row">
            <NavLink to="/dashboard" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/operations" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Operations
            </NavLink>
            <NavLink to="/forecast" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Forecast
            </NavLink>
            <NavLink to="/capacity" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Capacity
            </NavLink>
            <NavLink to="/bottlenecks" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Bottlenecks
            </NavLink>
            <NavLink to="/recommendations" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Recommendations
            </NavLink>
            <NavLink to="/inventory" className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}>
              Inventory
            </NavLink>
          </nav>

          {/* Log In / Manager Profile Button */}
          {user ? (
            <button className="btn-header-pill" onClick={() => navigate('/profile')}>
              <User size={15} />
              <span>{user?.name?.split(' ')?.[0] || 'Manager'}</span>
            </button>
          ) : (
            <button className="btn-header-pill" onClick={() => navigate('/auth')}>
              <User size={15} />
              <span>Log In →</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
