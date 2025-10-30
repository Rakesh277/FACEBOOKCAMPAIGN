import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected pages
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import CampaignScheduling from './pages/CampaignScheduling';
import CampaignList from './pages/CampaignList';
import AudienceTargeting from './pages/AudienceTargeting';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notification';
import EditCampaign from './pages/EditCampaign';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        {/* Redirect root based on auth status */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><CreateCampaign /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign-scheduling"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><CampaignScheduling /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaign-list"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><CampaignList /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-campaign/:id" // ✅ NEW EDIT ROUTE
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><EditCampaign /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audience-targeting"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><AudienceTargeting /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <div className="p-6 text-center text-red-600">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
};
export default App