import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Briefcase, Sparkles, KanbanSquare, CalendarDays,
  Users2, Trophy, User, LogOut, FileText, ChevronLeft, ChevronRight, Shield
} from 'lucide-react';

const studentNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/ai-career-suite', icon: Sparkles, label: 'AI Career Suite' },
  { to: '/tracker', icon: KanbanSquare, label: 'Application Tracker' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar & Deadlines' },
  { to: '/community', icon: Users2, label: 'Community & Mentorship' },
  { to: '/coding', icon: Trophy, label: 'Coding & Gamification' },
  { to: '/profile', icon: User, label: 'My Profile' },
];

export default function StudentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const hasResume = !!user?.resumeUrl;
  const profileComplete = Math.min(100, [
    user?.name, user?.email, user?.university, user?.department,
    user?.year, user?.skills?.length > 0, user?.resumeUrl
  ].filter(Boolean).length * 15);

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <aside className={`student-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="brand-icon"><Sparkles size={18} /></div>
            <div>
              <div className="brand-name">CareerHub AI</div>
              <div className="brand-sub">Student Portal</div>
            </div>
          </div>
        )}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Profile Summary */}
      {!collapsed && (
        <div className="sidebar-profile">
          <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.name || 'Student'}</div>
            <div className="profile-sub">{user?.department?.split('&')[0]?.trim() || 'Student'}</div>
            <div className="profile-completion">
              <div className="completion-bar">
                <div className="completion-fill" style={{ width: `${profileComplete}%` }}></div>
              </div>
              <span>{profileComplete}% profile</span>
            </div>
          </div>
        </div>
      )}

      {/* Resume Status Banner */}
      {!collapsed && !hasResume && (
        <div className="resume-warning" onClick={() => navigate('/profile')}>
          <FileText size={14} />
          <span>Upload resume to unlock AI Suite</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {studentNavItems.map(({ to, icon: Icon, label }) => {
          const isAI = to === '/ai-career-suite';
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isAI && !hasResume ? 'locked' : ''}`}
              title={collapsed ? label : ''}
              onClick={(e) => {
                if (isAI && !hasResume) {
                  e.preventDefault();
                  navigate('/profile');
                }
              }}
            >
              <Icon size={20} className="nav-icon" />
              {!collapsed && (
                <>
                  <span className="nav-label">{label}</span>
                  {isAI && (
                    <span className={`ai-badge ${hasResume ? 'unlocked' : 'locked-badge'}`}>
                      {hasResume ? 'AI' : '🔒'}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user-info">
            <div className="user-avatar-sm">{user?.name?.[0] || 'S'}</div>
            <div>
              <div className="user-name-sm">{user?.name}</div>
              <div className="user-role-sm">Student</div>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
