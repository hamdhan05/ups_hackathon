import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Building2, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, selectedFacility, setSelectedFacility } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

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
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
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
          <div
            className="logo-brand"
            onClick={() => {
              closeMobileMenu();
              navigate('/dashboard');
            }}
          >
            <div className="logipulse-shield">
              <Activity size={24} color="#FFC400" />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">LOGIPULSE</span>
              <span className="brand-subtext">PARCEL &amp; LOGISTICS INTELLIGENCE</span>
            </div>
          </div>

          {/* Desktop Horizontal Navigation Links */}
          <nav className="nav-links-row desktop-only-nav">
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

          {/* Action Group: Profile Pill & Mobile Menu Toggle */}
          <div className="header-actions-group">
            {user ? (
              <button
                className="btn-header-pill"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/profile');
                }}
              >
                <User size={15} />
                <span>{user?.name?.split(' ')?.[0] || 'Manager'}</span>
              </button>
            ) : (
              <button
                className="btn-header-pill"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/auth');
                }}
              >
                <User size={15} />
                <span>Log In →</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="mobile-menu-toggle-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} color="#330000" /> : <Menu size={22} color="#330000" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/operations"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Operations
            </NavLink>
            <NavLink
              to="/forecast"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Forecast
            </NavLink>
            <NavLink
              to="/capacity"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Capacity
            </NavLink>
            <NavLink
              to="/bottlenecks"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Bottlenecks
            </NavLink>
            <NavLink
              to="/recommendations"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Recommendations
            </NavLink>
            <NavLink
              to="/inventory"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Inventory
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
