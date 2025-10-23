import React, { useState } from "react";
import Layout from "@components/layout/Layout";
import axios from "axios";
import './CampaignScheduling.css';

interface ScheduledCampaign {
  id: number;
  campaignName: string;
  postDate: string;
  postTime: string;
  timezone: string;
  frequency: string;
  status: string;
}

const CampaignScheduling: React.FC = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    postDate: "",
    postTime: "",
    timezone: "",
    frequency: "",
  });

  const [scheduledCampaigns, setScheduledCampaigns] = useState<ScheduledCampaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.campaignName ||
      !formData.postDate ||
      !formData.postTime ||
      !formData.timezone ||
      !formData.frequency
    ) {
      setError("⚠️ Please fill in all fields before scheduling.");
      return;
    }
    setError(null);

    const newCampaign: ScheduledCampaign = {
      id: Date.now(),
      campaignName: formData.campaignName,
      postDate: formData.postDate,
      postTime: formData.postTime,
      timezone: formData.timezone,
      frequency: formData.frequency,
      status: "Scheduled",
    };

    try {
      // Send scheduled campaign details to backend API
      await axios.post("http://localhost:5000/api/facebook/schedule", newCampaign);

      setScheduledCampaigns((prev) => [...prev, newCampaign]);
      console.log("🕒 Scheduled Campaign:", newCampaign);

      // Reset form inputs
      setFormData({
        campaignName: "",
        postDate: "",
        postTime: "",
        timezone: "",
        frequency: "",
      });
    } catch (error) {
      setError("Failed to schedule campaign, please try again.");
    }
  };

  return (
    <div>
      <div className="create-campaign-card">
        <h2 className="section-title">🕒 Campaign Scheduling</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="create-campaign-form">
          <div className="form-row">
            <div className="form-group form-row-item">
              <label htmlFor="campaignName">Campaign Name</label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
                placeholder="Enter campaign name"
                className="create-campaign-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-row-item">
              <label htmlFor="postDate">Post Date</label>
              <input
                type="date"
                id="postDate"
                name="postDate"
                value={formData.postDate}
                onChange={handleChange}
                className="create-campaign-input"
              />
            </div>
            <div className="form-group form-row-item">
              <label htmlFor="postTime">Post Time</label>
              <input
                type="time"
                id="postTime"
                name="postTime"
                value={formData.postTime}
                onChange={handleChange}
                className="create-campaign-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-row-item">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="create-campaign-select"
              >
                <option value="">Select Timezone</option>
                <option value="IST">IST (UTC +5:30)</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST (UTC -5)</option>
                <option value="PST">PST (UTC -8)</option>
                <option value="CET">CET (UTC +1)</option>
              </select>
            </div>
            <div className="form-group form-row-item">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="create-campaign-select"
              >
                <option value="">Select Frequency</option>
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div className="submit-container">
            <button type="submit" className="create-campaign-submit">
              Schedule Campaign
            </button>
          </div>
        </form>

        {/* Scheduled Campaigns Table */}
        <div className="scheduled-campaigns-table">
          <h3 className="sub-title">📅 Scheduled Campaigns</h3>
          {scheduledCampaigns.length === 0 ? (
            <p className="text-gray-400">No campaigns scheduled yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg">
                <thead>
                  <tr className="text-left text-teal-400 border-b border-gray-700">
                    <th className="py-2 px-4">Campaign Name</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Time</th>
                    <th className="py-2 px-4">Timezone</th>
                    <th className="py-2 px-4">Frequency</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledCampaigns.map((c) => (
                    <tr key={c.id} className="border-b border-gray-700">
                      <td className="py-2 px-4">{c.campaignName}</td>
                      <td className="py-2 px-4">{c.postDate}</td>
                      <td className="py-2 px-4">{c.postTime}</td>
                      <td className="py-2 px-4">{c.timezone}</td>
                      <td className="py-2 px-4">{c.frequency}</td>
                      <td className="py-2 px-4 text-green-400">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignScheduling;
