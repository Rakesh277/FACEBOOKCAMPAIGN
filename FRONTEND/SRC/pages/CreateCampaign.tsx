import React, { useState } from "react";
import Layout from "@components/layout/Layout";
import axios from "axios";
import "./CreateCampaign.css";


const CreateCampaign: React.FC = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    pageName: "",
    objective: "",
    adType: "",
    caption: "",
    budget: "",
    duration: "",
  });


  const [error, setError] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false); // To show a loading state


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  // --- AI Caption Generation Function ---
  const handleGenerateCaption = async () => {
    if (!formData.campaignName || !formData.objective) {
      setError("Please enter a Campaign Name and select an Objective for the AI.");
      return;
    }
    setError(null);
    setIsLoadingAI(true);


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication error. Please log in again.");
        setIsLoadingAI(false);
        return;
      }


      const prompt = `Generate a short, engaging Facebook post caption for a marketing campaign named "${formData.campaignName}" with the objective of "${formData.objective}".`;


      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-caption",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.data.caption) {
        setFormData((prev) => ({ ...prev, caption: response.data.caption }));
      }
    } catch (err: any) {
      console.error("AI generation failed:", err.response?.data || err.message);
      setError("AI caption generation failed. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };


  // --- Form Submission to Save Campaign ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!formData.campaignName || !formData.pageName || !formData.objective || !formData.caption) {
      setError("Please fill all required fields.");
      return;
    }
    setError(null);


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication error. Please log in again.");
        return;
      }


      const response = await axios.post(
        "http://localhost:5000/api/campaigns",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      alert("Campaign created and saved successfully!");
      console.log("Server response:", response.data);


      setFormData({
        campaignName: "",
        pageName: "",
        objective: "",
        adType: "",
        caption: "",
        budget: "",
        duration: "",
      });
    } catch (err: any) {
      console.error("Failed to create campaign:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create campaign. Please try again.");
    }
  };


  return (
    <div>
      <div className="create-campaign-card">
        <h2 className="section-title">Create Campaign</h2>


        <form onSubmit={handleSubmit} className="create-campaign-form">
          {error && <div className="form-error">{error}</div>}


          {/* Campaign Name */}
          <div className="form-group">
            <label htmlFor="campaignName">Campaign Name</label>
            <input
              id="campaignName"
              name="campaignName"
              type="text"
              value={formData.campaignName}
              onChange={handleChange}
              placeholder="Enter campaign name"
              required
              className="create-campaign-input"
            />
          </div>


          {/* Page Name */}
          <div className="form-group">
            <label htmlFor="pageName">Company / Page Name</label>
            <input
              id="pageName"
              name="pageName"
              type="text"
              value={formData.pageName}
              onChange={handleChange}
              placeholder="Enter page name"
              required
              className="create-campaign-input"
            />
          </div>


          {/* Objective */}
          <div className="form-group">
            <label htmlFor="objective">Objective</label>
            <select
              id="objective"
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              required
              className="create-campaign-select"
            >
              <option value="">Select Objective</option>
              <option value="engagement">Engagement</option>
              <option value="leads">Leads</option>
              <option value="sales">Sales</option>
            </select>
          </div>


          {/* Caption */}
          <div className="form-group">
            <label htmlFor="caption">Description</label>
            <textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Write ad description or generate with AI"
              required
              className="create-campaign-textarea"
            />
          


          
          <div className="form-group">
            <label htmlFor="adType">Ad Type</label>
            <select
              id="adType"
              name="adType"
              value={formData.adType}
              onChange={handleChange}
              className="create-campaign-select"
            >
              <option value="">Select Ad Type</option>
              <option value="single">Single Image</option>
              <option value="carousel">Carousel</option>
              <option value="video">Video</option>
            </select>
          </div>


          <div className="form-group">
            <label htmlFor="postCopy">Post Copy / Caption</label>
            <input
              id="postCopy"
              name="postCopy"
              type="text"
              placeholder="Auto generated by AI"
              readOnly
              className="create-campaign-input"
            />
          </div>


          {/* Media Upload */}
          <div className="radio-button">
            <label htmlFor="mediaUpload">Media Upload</label>
            <input
              id="mediaUpload"
              name="mediaUpload"
              type="text"
              placeholder="# Auto selected by AI"
              readOnly
              className="create-campaign-input"
            />
          </div>


          {/* Budget & Duration */}
          <div className="form-row">
            <div className="form-group form-row-item">
              <label htmlFor="budget">Budget</label>
              <input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder=" "
                className="create-campaign-input"
              />
            </div>



            <div className="form-group form-row-item">
              <label htmlFor="duration">Duration (Days)</label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                placeholder=" "
                className="create-campaign-input"
              />
            </div>
          </div>


          {/* AI Assistance Toggle */}
          <div className="ai-assist">
            <label htmlFor="aiAssistToggle" className="switch">
              <input id="aiAssistToggle" type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
            <label htmlFor="aiAssistToggle" className="ai-assist-text">
              AI Assistance
            </label>
          </div>
  {/* --- AI GENERATION BUTTON --- */}
            <button
              type="button"
              onClick={handleGenerateCaption}
              disabled={isLoadingAI}
              className="ai-generate-button"
            >
              {isLoadingAI ? 'Generating...' : 'Generate with AI ✨'}
            </button>
          </div>



          {/* Submit Button */}
          <div className="submit-container">
            <button type="submit" className="create-campaign-submit">
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CreateCampaign;