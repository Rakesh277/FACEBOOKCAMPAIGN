import React, { useState, useEffect } from "react";
import Layout from "@components/layout/Layout";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react";
import './CampaignList.css'; // We'll create this CSS file


// 1. UPDATED interface to match your backend's Campaign model
interface Campaign {
  _id: string;
  name: string;
  caption: string;
  status: "scheduled" | "published" | "failed";
  postDate: string; // The backend sends dates as ISO strings
}


const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // NEW: State for loading and errors
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();


  // 2. REPLACED sample data with a real API call
  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }


      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/campaigns', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaigns(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError('Could not load your campaigns. Please try again.');
      } finally {
        setLoading(false);
      }
    };


    fetchCampaigns();
  }, [navigate]);


  // This logic remains the same, but now works on real data
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "all" || c.status === filter)
  );


  // 3. UPDATED status colors to match backend statuses
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-900/30";
      case "scheduled":
        return "text-yellow-400 bg-yellow-900/30";
      case "failed":
        return "text-red-400 bg-red-900/30";
      default:
        return "text-gray-300 bg-gray-700";
    }
  };


  return (
    <div >
      <div className="create-campaign-card">
        <h2 className="section-title">📋 Campaign List</h2>


        {/* Search & Filter Section (Your excellent UI is preserved) */}
        <div className="form-row margin-bottom-20">
          <div className="form-group form-row-item relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="create-campaign-input padded-left"
            />
          </div>
          <div className="form-group form-row-item max-width-180">
            <label htmlFor="campaignFilter" className="sr-only">
              Filter campaigns by status
            </label>
            {/* 4. UPDATED filter options */}
            <select
              id="campaignFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="create-campaign-select"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>


        {/* Campaign Table */}
        <div className="overflow-x-auto">
          {loading && <p className="text-gray-400 text-center py-8">Loading campaigns...</p>}
          {error && <p className="text-red-500 text-center py-8">{error}</p>}
          
          {!loading && !error && filteredCampaigns.length === 0 && (
             <div className="no-campaigns">
                <p>No campaigns found.</p>
                <button onClick={() => navigate('/create-campaign')} className="create-first-campaign-btn">
                  Create Your First Campaign
                </button>
            </div>
          )}


          {!loading && !error && filteredCampaigns.length > 0 && (
            <table className="min-w-full rounded-lg bg-gray-800 text-white">
              <thead>
                <tr className="text-left text-teal-400 border-b border-gray-700">
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Scheduled For</th>
                  <th className="py-3 px-4">Caption</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign._id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    {/* 5. Displaying real data from the backend */}
                    <td className="py-3 px-4">{new Date(campaign.postDate).toLocaleString()}</td>
                    <td className="py-3 px-4 caption-cell">{campaign.caption}</td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button className="text-blue-400 hover:text-blue-500 text-sm font-semibold">View</button>
                      <button className="text-yellow-400 hover:text-yellow-500 text-sm font-semibold">Edit</button>
                      <button className="text-red-400 hover:text-red-500 text-sm font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};


export default CampaignList;