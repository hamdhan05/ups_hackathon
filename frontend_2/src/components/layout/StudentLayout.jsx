import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function StudentLayout() {
  return (
    <div className="app-shell">
      <Navbar isAdmin={false} />
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <footer className="ups-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span>LOGIPULSE</span> — Operational Intelligence & Parcel Logistics Platform
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Operations Support</a>
            <a href="#status">Network Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
