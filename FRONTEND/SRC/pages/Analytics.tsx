import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '@components/layout/Layout';
import './Analytics.css'; // We will create a new CSS file for this component

// 1. Define an interface for the data we expect from the backend
interface AnalyticsData {
  reach: number;
  engagement: number;
  clicks: number;
}

const AnalyticsPage: React.FC = () => {
  // 2. Get the specific campaign ID from the URL (e.g., /analytics/12345)
  const { campaignId } = useParams<{ campaignId: string }>();
  
  // 3. Set up state to manage the fetched data, loading status, and errors
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 4. Use useEffect to fetch data when the component loads
  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        // Make the API call to the backend endpoint you created
        const response = await axios.get(
          `http://localhost:5000/api/analytics/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnalytics(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics data.');
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchAnalytics();
    }
  }, [campaignId, navigate]);

  return (
    
      <div className="analytics-container">
        <h1 className="section-title">Campaign Analytics</h1>

        {/* 5. Conditionally render content based on the state */}
        {loading && <p className="loading-message">Loading analytics...</p>}
        
        {error && <p className="error-message">{error}</p>}
        
        {analytics && !loading && (
          <div className="analytics-grid">
            {/* Card for Reach */}
            <div className="analytics-card">
              <h3 className="card-title">Total Reach</h3>
              <p className="card-value">{analytics.reach.toLocaleString()}</p>
              <p className="card-description">The number of unique people who saw your post.</p>
            </div>

            {/* Card for Engagement */}
            <div className="analytics-card">
              <h3 className="card-title">Total Engagement</h3>
              <p className="card-value">{analytics.engagement.toLocaleString()}</p>
              <p className="card-description">The number of people who liked, commented, or shared.</p>
            </div>

            {/* Card for Clicks */}
            <div className="analytics-card">
              <h3 className="card-title">Link Clicks</h3>
              <p className="card-value">{analytics.clicks.toLocaleString()}</p>
              <p className="card-description">The number of clicks on links within your post.</p>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default AnalyticsPage;
