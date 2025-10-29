import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '@components/layout/Layout';
import './dashboard.css';

interface User {
  email: string;
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
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err: any) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <Layout>
      <div className="dashboard-wrapper">
        <hr className="dashboard-divider" />
        <h1 className="dashboard-title">Dashboard</h1>
        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-grid">
          <div
            className="grid-item create-campaign"
            onClick={() => navigate('/create-campaign')}
          >
            Create Campaign
          </div>

          <div
            className="grid-item"
            onClick={() => navigate('/campaign-scheduling')}
          >
            Campaign Scheduling
          </div>

          <div
            className="grid-item"
            onClick={() => navigate('/audience-targeting')}
          >
            Audience Targeting
          </div>

          <div
            className="grid-item"
            onClick={() => navigate('/campaign-list')}
          >
            Campaign List
          </div>

          <div
            className="grid-item"
            onClick={() => navigate('/analytics')}
          >
            Analytics
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;