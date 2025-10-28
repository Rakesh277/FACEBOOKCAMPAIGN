import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '@components/layout/Layout'; // Assuming this is the correct path
import './dashboard.css';

// Updated User interface to include the new optional fields
interface User {
  email: string;
  facebookId?: string;
  facebookAccessToken?: string; // This is the key field we need
  role?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(''); // For success messages
  const navigate = useNavigate();
  const location = useLocation(); // To read URL query parameters
  const isAuth = useAuth();

  // Check for authentication token on initial load
  useEffect(() => {
    if (!isAuth) {
      console.warn('🔒 No token found, redirecting to login...');
      navigate('/login');
    }
  }, [isAuth, navigate]);

  // --- NEW: Check for a successful Facebook connection message in the URL ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('facebook') === 'connected') {
      setNotification('✅ Successfully connected to Facebook!');
      // Optional: clean up the URL
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  // Fetch user data, including Facebook connection status
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        // This endpoint should return the full user object, including facebookAccessToken
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          setUser(res.data.user);
          console.log('✅ Dashboard data loaded:', res.data.user);
        } else {
          throw new Error('Invalid response structure from /api/dashboard');
        }
      } catch (err: any) {
        console.error('❌ Token invalid or expired:', err.response?.data?.message || err.message);
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div >
      <div className="create-campaign">
        <h1 className="section-title">Dashboard</h1>
        {error && <p className="dashboard-error">{error}</p>}
        {notification && <p className="dashboard-notification">{notification}</p>}

        {/* --- NEW: Conditional Rendering based on Facebook Connection --- */}
        <div className="connection-status">
          {user && user.facebookAccessToken ? (
            <p><strong>Status:</strong> <span className="status-connected">Connected to Facebook</span></p>
          ) : (
            <p><strong>Status:</strong> <span className="status-disconnected">Not Connected to Facebook</span></p>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="grid-item" onClick={() => navigate('/campaign-scheduling')}>
            Campaign Scheduling
          </div>
          <div className="grid-item" onClick={() => navigate('/create-campaign')}>
            Create Campaign
          </div>
          <div className="grid-item" onClick={() => navigate('/audience-targeting')}>
            Audience Targeting
          </div>
          <div className="grid-item" onClick={() => navigate('/campaign-list')}>
            Campaign List
          </div>
          <div className="grid-item" onClick={() => navigate('/analytics')}>
            Analytics
          </div>
        </div>

        {/* --- NEW: Show "Connect" button only if the user is NOT connected --- */}
        {user && !user.facebookAccessToken && (
          <div className="connect-container">
            <p>Connect your account to start automating your campaigns.</p>
            <a href="http://localhost:5000/api/auth/facebook" className="connect-facebook-button">
              Connect to Facebook
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
