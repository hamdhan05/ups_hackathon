import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Navigation
import StudentLayout from './components/layout/StudentLayout';

// LogiPulse Dedicated Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import OperationsPage from './pages/OperationsPage';
import ForecastPage from './pages/ForecastPage';
import CapacityPage from './pages/CapacityPage';
import BottlenecksPage from './pages/BottlenecksPage';
import RecommendationsPage from './pages/RecommendationsPage';
import InventoryPage from './pages/InventoryPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem 8%', color: '#330000', fontFamily: 'Inter, sans-serif' }}>Loading LogiPulse Platform...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Main LogiPulse Application Routes */}
          <Route path="/" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="forecast" element={<ForecastPage />} />
            <Route path="capacity" element={<CapacityPage />} />
            <Route path="bottlenecks" element={<BottlenecksPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
