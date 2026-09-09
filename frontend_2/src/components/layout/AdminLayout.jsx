import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <Navbar isAdmin={true} />
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <footer className="ups-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span>LOGIPULSE</span> — Global Network Control Center
          </div>
          <div className="footer-links">
            <a href="#privacy">Network Policy</a>
            <a href="#compliance">Security Compliance</a>
            <a href="#help">Command Helpdesk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
