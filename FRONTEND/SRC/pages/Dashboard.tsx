import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '@components/layout/Layout';
import './dashboard.css'; // Ensure this file has updated styles

interface User {
  email: string;
  facebookId: string;
  role?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAuth = useAuth();

  useEffect(() => {
    if (!isAuth) {
      console.warn('🔒 No token found, redirecting to login...');
      navigate('/login');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log('📦 Token being sent to /api/dashboard:', token);

      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          setUser(res.data.user);
          console.log('✅ Dashboard data loaded:', res.data.user);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err: any) {
        console.error(
          '❌ Token invalid or expired:',
          err.response?.data?.message || err.message
        );
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div >
      <div className="create-campaign-card dashboard-card">
        <h1 className="section-title">Dashboard</h1>
        {error && <p className="dashboard-error">{error}</p>}

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
      </div>
    </div>
  );
};

export default Dashboard;
