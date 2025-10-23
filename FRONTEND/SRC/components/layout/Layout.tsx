import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Layout.css'; // External styles for background, logo, etc.
import logo from '@assets/logo.png'; // Your logo file
import Notification from './Notification';

import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaArrowLeft,
  FaBell,
} from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [notification, setNotification] = useState<{
    message: string;
    type?: 'success' | 'error' | 'info';
  } | null>(null);

  // Pages where top buttons are hidden
  const excludedRoutes = ['/login', '/register'];
  const showTopButtons = !excludedRoutes.includes(location.pathname) && token;

  // Pages where back button is hidden
  const showBackButton = !excludedRoutes.includes(location.pathname);

  // Pages where header should be hidden
  const excludedHeaderRoutes = [
    '/createcampaign',
    '/audiencetargeting',
    '/campaignlist',
    '/analytics',
    '/campaignscheduling',
    '/notifications', // ✅ lowercase route
  ];
  const showHeader = !excludedHeaderRoutes.includes(location.pathname);

  const handleBack = () => {
    if (location.pathname === '/register') {
      navigate('/login');
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setNotification({ message: 'Logged out successfully.', type: 'info' });
    setTimeout(() => navigate('/login'), 1500);
  };

  const handleNotificationClick = () => {
    setNotification({ message: 'You have 3 new alerts.', type: 'info' });
    navigate('/notifications');
  };

  return (
    <div className="layout-container">
      <div className="layout-overlay" />

      {/* Notification Banner */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Top-left back button */}
      {showBackButton && (
        <button
          className="layout-back-button"
          onClick={handleBack}
          title="Go Back"
        >
          <FaArrowLeft />
        </button>
      )}

      {/* Top-right navigation buttons */}
      {showTopButtons && (
        <div className="layout-top-buttons">
          <FaBell
            className="layout-icon"
            title="Notifications"
            onClick={handleNotificationClick}
          />
          <FaUserCircle
            className="layout-icon"
            title="Profile"
            onClick={() => navigate('/profile')}
          />
          <FaCog
            className="layout-icon"
            title="Settings"
            onClick={() => navigate('/settings')}
          />
          <FaSignOutAlt
            className="layout-icon"
            title="Logout"
            onClick={handleLogout}
          />
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <header className="layout-header">
          <img src={logo} alt="AI Campaign Logo" className="layout-logo" />
          <div className="layout-title-group">
            <h1 className="layout-title-line">AI Facebook</h1>
            <h1 className="layout-title-line">
              Campaign <span className="highlight">Assistant</span>
            </h1>
          </div>
        </header>
      )}

      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;