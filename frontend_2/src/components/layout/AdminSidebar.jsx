import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Briefcase, PlusCircle, Tag, Building2,
  Megaphone, BarChart3, Flag, Settings, LogOut, Shield,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  {
    group: 'User Management',
    items: [
      { to: '/admin/students', icon: Users, label: 'Student Management' },
    ]
  },
  {
    group: 'Opportunity Management',
    items: [
      { to: '/admin/opportunities', icon: Briefcase, label: 'Manage Opportunities' },
      { to: '/admin/opportunities/new', icon: PlusCircle, label: 'Add Opportunity' },
      { to: '/admin/categories', icon: Tag, label: 'Category Management' },
      { to: '/admin/companies', icon: Building2, label: 'Company Management' },
    ]
  },
  {
    group: 'Communication',
    items: [
      { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
    ]
  },
  {
    group: 'Insights',
    items: [
      { to: '/admin/analytics', icon: BarChart3, label: 'Reports & Analytics' },
    ]
  },
  {
    group: 'Administration',
    items: [
      { to: '/admin/moderation', icon: Flag, label: 'Content Moderation' },
      { to: '/admin/settings', icon: Settings, label: 'System Settings' },
    ]
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="brand-icon admin-icon"><Shield size={18} /></div>
            <div>
              <div className="brand-name">CareerHub AI</div>
              <div className="brand-sub">Admin Portal</div>
            </div>
          </div>
        )}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Admin Profile */}
      {!collapsed && (
        <div className="sidebar-profile admin-profile">
          <div className="profile-avatar admin-avatar">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.name || 'Admin'}</div>
            <div className="profile-sub admin-badge-text">Administrator</div>
            <div className="admin-dept">{user?.department || 'Career Development Center'}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav admin-nav">
        {adminNavItems.map((item, idx) => {
          if (item.to) {
            return (
              <NavLink key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}>
                <item.icon size={20} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            );
          }
          return (
            <div key={idx} className="nav-group">
              {!collapsed && <div className="nav-group-label">{item.group}</div>}
              {item.items.map(subItem => (
                <NavLink key={subItem.to} to={subItem.to}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={collapsed ? subItem.label : ''}>
                  <subItem.icon size={20} className="nav-icon" />
                  {!collapsed && <span className="nav-label">{subItem.label}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user-info">
            <div className="user-avatar-sm admin-avatar-sm">{user?.name?.[0] || 'A'}</div>
            <div>
              <div className="user-name-sm">{user?.name}</div>
              <div className="user-role-sm admin-role-sm">Administrator</div>
            </div>
          </div>
        )}
        <button className="logout-btn admin-logout" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
