import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email || 'manager@logipulse.demo', password || 'LogiPulse2026!');
    if (res?.success) navigate('/dashboard');
    setLoading(false);
  };

  const handleQuickDemo = () => {
    setEmail('manager@logipulse.demo');
    setPassword('LogiPulse2026!');
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#F2F1EF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9D7D3', borderTop: '6px solid #FFC400', borderRadius: '6px', maxWidth: '850px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', boxShadow: '0 8px 24px rgba(51, 0, 0, 0.08)' }}>
        {/* LEFT BRAND PANEL (UPS DARK BROWN #330000) */}
        <div style={{ backgroundColor: '#330000', color: '#FFFFFF', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: '#FFC400', color: '#330000', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                <Activity size={24} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#FFC400' }}>LOGIPULSE</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFFFFF', marginBottom: '1rem' }}>
              Operational Intelligence Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#F2F1EF', lineHeight: '1.6', marginBottom: '2rem' }}>
              Access hub capacity manifests, shift workforce calculators, and automated parcel flow rerouting tools.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFC400' }}>
                <CheckCircle2 size={16} /> Live Air Gateway & Sort Facility Metrics
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFC400' }}>
                <CheckCircle2 size={16} /> Shift Labor Deficit & Capacity Gap Analysis
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFC400' }}>
                <CheckCircle2 size={16} /> Automated Bottleneck Resolution Workflow
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#A0A0A0', marginTop: '2rem' }}>
            LOGIPULSE Operational Intelligence • Official Logistics Portal
          </div>
        </div>

        {/* RIGHT BASIC LOGIN FORM */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#330000' }}>Log In</h3>
            <div className="heading-accent-line" style={{ width: '48px', height: '4px', backgroundColor: '#FFC400', marginTop: '4px' }}></div>
            <p style={{ fontSize: '0.88rem', color: '#555555', marginTop: '6px' }}>
              Enter your operational credentials to access your manager dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="filter-field-group">
              <label>Work Email / Username</label>
              <input
                type="email"
                className="ups-input"
                placeholder="e.g. m.vance@logipulse-global.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="filter-field-group">
              <label>Password</label>
              <input
                type="password"
                className="ups-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {/* EXACT #FFC400 PILL BUTTON SPECIFICATION */}
            <button type="submit" className="btn-ups-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'AUTHENTICATING...' : 'LOG IN →'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #EAE8E4', textAlign: 'center' }}>
            <button
              type="button"
              className="link-ups-blue"
              onClick={handleQuickDemo}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Fill Sample Manager Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
