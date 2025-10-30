import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditCampaign: React.FC = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaign(response.data);
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      }
    };

    fetchCampaign();
  }, [id]);

  return (
    <div className="edit-campaign-page">
      <h2>Edit Campaign</h2>
      {campaign ? (
        <div>
          <p><strong>Name:</strong> {campaign.name}</p>
          <p><strong>Status:</strong> {campaign.status}</p>
          {/* Add form fields here to allow editing */}
        </div>
      ) : (
        <p>Loading campaign...</p>
      )}
    </div>
  );
};

export default EditCampaign;