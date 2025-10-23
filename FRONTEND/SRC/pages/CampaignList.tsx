import React, { useState, useEffect } from "react";
import Layout from "@components/layout/Layout";
import { Search } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "Active" | "Scheduled" | "Paused";
  startDate: string;
  endDate: string;
}

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Sample data - replace with API fetch
    const sampleData: Campaign[] = [
      {
        id: "1",
        name: "Diwali Promo",
        status: "Active",
        startDate: "2025-10-10",
        endDate: "2025-10-20",
      },
      
      {
        id: "2",
        name: "Winter Sale",
        status: "Scheduled",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
      },
      {
        id: "2",
        name: "Winter Sale",
        status: "Scheduled",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
      },
      {
        id: "2",
        name: "Winter Sale",
        status: "Scheduled",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
      },
      {
        id: "2",
        name: "Winter Sale",
        status: "Scheduled",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
      },
      {
        id: "2",
        name: "Winter Sale",
        status: "Scheduled",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
      },
      {
        id: "2",
        name: "Winter Sale",
        status: "Scheduled",
        startDate: "2025-11-01",
        endDate: "2025-11-15",
      },
      {
        id: "3",
        name: "New Year Blast",
        status: "Paused",
        startDate: "2025-12-20",
        endDate: "2026-01-05",
      },
    ];
    setCampaigns(sampleData);
  }, []);

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "all" || c.status === filter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400 bg-green-900/30";
      case "Scheduled":
        return "text-yellow-400 bg-yellow-900/30";
      case "Paused":
        return "text-red-400 bg-red-900/30";
      default:
        return "text-gray-300 bg-gray-700";
    }
  };

  return (
    <div >
      <div className="create-campaign-card">
        <h2 className="section-title">📋 Campaign List</h2>

        {/* Search & Filter Section */}
        <div className="form-row margin-bottom-20">
          {/* Search */}
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

          {/* Filter */}
          <div className="form-group form-row-item max-width-180">
            <label htmlFor="campaignFilter" className="sr-only">
              Filter campaigns by status
            </label>
            <select
              id="campaignFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="create-campaign-select"
            >
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          {filteredCampaigns.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No campaigns found.</p>
          ) : (
            <table className="min-w-full rounded-lg bg-gray-800 text-white">
              <thead>
                <tr className="text-left text-teal-400 border-b border-gray-700">
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{campaign.startDate}</td>
                    <td className="py-3 px-4">{campaign.endDate}</td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button className="text-blue-400 hover:text-blue-500 text-sm font-semibold">
                        View
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-500 text-sm font-semibold">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-500 text-sm font-semibold">
                        Delete
                      </button>
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
