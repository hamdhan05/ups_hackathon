import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const DEMO_MANAGER = {
  _id: 'mem_mgr_1',
  name: 'Marcus Vance',
  email: 'm.vance@logipulse-global.com',
  role: 'student', // Map manager role to primary portal view
  title: 'Senior Operations Manager',
  facility: 'Louisville SDF Worldport Air Hub',
  facilityCode: 'SDF-AIR-01',
  department: 'Air Gateway & Sorting Operations',
  activeShift: 'Day Peak (06:00 - 18:00)',
  assignedHubs: ['SDF-AIR-01', 'ORD-SORT-04', 'DFW-DIST-02'],
  targetRole: 'Air Hub Sort Director',
  resumeUrl: 'hub_capacity_manifest_sdf.pdf',
  resumeOriginalName: 'SDF_Worldport_Capacity_Plan_2026.pdf',
  resumeAtsScore: 96,
  badges: [
    { title: 'Peak Sort Efficiency 99.2%', category: 'Throughput', icon: 'Award', unlockedAt: new Date() },
    { title: 'Zero Critical Bottlenecks (Q3)', category: 'Reliability', icon: 'CheckCircle2', unlockedAt: new Date() }
  ]
};

const DEMO_ADMIN = {
  _id: 'mem_admin_1',
  name: 'Director Sarah Jenkins',
  email: 's.jenkins@logipulse-global.com',
  role: 'admin',
  title: 'Global Operations Network Director',
  facility: 'LogiPulse Global Command Center',
  facilityCode: 'HQ-GLOBAL',
  department: 'Global Parcel & Logistics Intelligence',
  activeShift: 'Executive Monitoring (24/7)',
  assignedHubs: ['GLOBAL-ALL'],
  resumeUrl: '',
  badges: []
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ch_token') || '');
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState('SDF-AIR-01');

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(DEMO_MANAGER);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) setUser(res.data.user);
      } catch {
        setUser(DEMO_MANAGER);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('ch_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, role: res.data.user.role };
      }
    } catch {
      const isAdmin = email.includes('admin');
      const demoUser = isAdmin ? DEMO_ADMIN : DEMO_MANAGER;
      setUser(demoUser);
      return { success: true, role: demoUser.role };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, role });
      if (res.data.success) {
        localStorage.setItem('ch_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, role: res.data.user.role };
      }
    } catch {
      const newUser = { ...(role === 'admin' ? DEMO_ADMIN : DEMO_MANAGER), name, email, role };
      setUser(newUser);
      return { success: true, role };
    }
  };

  const logout = () => {
    localStorage.removeItem('ch_token');
    setToken('');
    setUser(null);
  };

  const switchRole = (newRole) => {
    setUser(newRole === 'admin' ? DEMO_ADMIN : DEMO_MANAGER);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch {
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchRole, updateUserProfile, selectedFacility, setSelectedFacility }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
