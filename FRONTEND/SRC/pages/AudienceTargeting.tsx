import React, { useState } from "react";
import Layout from "@components/layout/Layout";
import "./AudienceTargeting.css"; // You should create this CSS or use CreateCampaign.css styles

const AudienceTargeting: React.FC = () => {
  const [audienceData, setAudienceData] = useState({
    minAge: "",
    maxAge: "",
    gender: "",
    location: "",
    interests: "",
    language: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAudienceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/audience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(audienceData),
      });

      if (res.ok) {
        alert("Audience targeting saved successfully!");
      } else {
        alert("Failed to save audience data.");
      }
    } catch (error) {
      console.error("Error saving audience data:", error);
      alert("Error occurred while saving.");
    }
  };

  return (
    <div>
      <div className="create-campaign-card">
        <h2 className="section-title">Audience Targeting</h2>
        <form onSubmit={handleSubmit} className="create-campaign-form">
          {/* Age Range */}
          <div className="form-row">
            <div className="form-group form-row-item">
              <label htmlFor="minAge">Minimum Age</label>
              <input
                id="minAge"
                name="minAge"
                type="number"
                min={13}
                max={65}
                value={audienceData.minAge}
                onChange={handleChange}
                placeholder="e.g. 18"
                required
                className="create-campaign-input"
              />
            </div>
            <div className="form-group form-row-item">
              <label htmlFor="maxAge">Maximum Age</label>
              <input
                id="maxAge"
                name="maxAge"
                type="number"
                min={13}
                max={100}
                value={audienceData.maxAge}
                onChange={handleChange}
                placeholder="e.g. 50"
                required
                className="create-campaign-input"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={audienceData.gender}
              onChange={handleChange}
              className="create-campaign-select"
            >
              <option value="">Select Gender</option>
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={audienceData.location}
              onChange={handleChange}
              placeholder="e.g. New York, USA"
              required
              className="create-campaign-input"
            />
          </div>

          {/* Interests */}
          <div className="form-group">
            <label htmlFor="interests">Interests</label>
            <textarea
              id="interests"
              name="interests"
              value={audienceData.interests}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Technology, Fitness, Travel..."
              className="create-campaign-textarea"
            />
          </div>

          {/* Language */}
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <input
              id="language"
              name="language"
              type="text"
              value={audienceData.language}
              onChange={handleChange}
              placeholder="e.g. English"
              className="create-campaign-input"
            />
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="create-campaign-submit">
              Save Audience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AudienceTargeting;