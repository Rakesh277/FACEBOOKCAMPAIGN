import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateCampaign.css";

// Interface for Facebook Page data
interface Page {
  id: string;
  name: string;
}

const CreateCampaign: React.FC = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    pageName: "", // Changed from pageName to pageId for better accuracy
    objective: "",
    adType: "",
    caption: "",
    budget: "",
    duration: "",
    imageUrl: "", // To store the URL of the generated image
  });

  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGeneratedPost, setAiGeneratedPost] = useState<string | null>(null);
  const [isPostConfirmed, setIsPostConfirmed] = useState(false);

  // --- Fetch User's Facebook Pages on Component Mount ---
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication error. Please log in again.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/facebook/pages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.pages) {
          setPages(response.data.pages);
        }
      } catch (err: any) {
        console.error("Failed to fetch pages:", err.response?.data || err.message);
        setError("Failed to load your Facebook pages. Please refresh the page.");
      }
    };

    fetchPages();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- AI Caption Generation ---
  const handleGenerateCaption = async () => {
    if (!formData.campaignName || !formData.objective) {
      setError("Please enter a Campaign Name and select an Objective first.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const prompt = `Generate a short, engaging Facebook post caption for a marketing campaign named "${formData.campaignName}" with the objective of "${formData.objective}".`;
      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-caption",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.caption) {
        setFormData((prev) => ({ ...prev, caption: response.data.caption }));
      }
    } catch (err: any) {
      console.error("AI caption generation failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "AI caption generation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- AI Full Post Generation ---
  const handleGeneratePost = async () => {
    if (!formData.caption || !formData.adType) {
      setError("Please provide a description and select an Ad Type.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const prompt = `Based on the description: "${formData.caption}" and for an ad type of "${formData.adType}", generate a complete and engaging Facebook post.`;

      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-post", // CORRECTED ENDPOINT
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.post) {
        setAiGeneratedPost(response.data.post);
        setIsPostConfirmed(false);
      }
    } catch (err: any) {
      console.error("AI post generation failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to generate AI post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- AI Image Generation ---
  const handleGenerateImage = async () => {
    if (!formData.caption) {
      setError("Please provide a description to generate an image from.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
        const token = localStorage.getItem("token");
        const prompt = `Create a visually appealing image for a Facebook ad based on this description: "${formData.caption}"`;
        const response = await axios.post(
            "http://localhost:5000/api/ai/generate-image", // NEW ENDPOINT
            { prompt },
            { 
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob' // Important for handling image response
            }
        );

        if (response.data) {
            const imageUrl = URL.createObjectURL(response.data);
            setFormData(prev => ({ ...prev, imageUrl }));
        }
    } catch (err: any) {
        console.error("AI image generation failed:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to generate AI image. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };


  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaignName || !formData.pageName || !formData.objective || !formData.caption) {
      setError("Please fill all required fields before submitting.");
      return;
    }
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/campaigns", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Campaign created successfully!");
      // Reset form state
      setFormData({
        campaignName: "",
        pageName: "",
        objective: "",
        adType: "",
        caption: "",
        budget: "",
        duration: "",
        imageUrl: "",
      });
      setAiGeneratedPost(null);
      setIsPostConfirmed(false);
    } catch (err: any) {
      console.error("Failed to create campaign:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create campaign. Please try again.");
    }
  };

  return (
    <div>
      <div className="create-campaign">
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
              placeholder="campaign name"
              required
              className="create-campaign-input"
            />
          </div>

          {/* Page Name */}
          <div className="form-group">
            <label htmlFor="pageName">Page Name</label>
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

          {/* Caption / Description */}
          <div className="form-group">
            <label htmlFor="caption">Ad Description</label>
            <textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Describe your product or offer, or generate with AI."
              required
              className="create-campaign-textarea"
            />
            <button
              type="button"
              onClick={handleGenerateCaption}
              disabled={isLoading}
              className="ai-generate-button"
            >
              {isLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          
          {/* Ad Type */}
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

          {/* AI Post & Image Generation Section */}
          <div className="form-group">
             <button
                 type="button"
                 onClick={handleGeneratePost}
                 disabled={isLoading || !formData.caption || !formData.adType}
                 className="ai-generate-button"
             >
                 {isLoading ? "Generating..." : "Generate Full Post"}
             </button>

             {aiGeneratedPost && !isPostConfirmed && (
                 <div className="ai-post-preview">
                     <label>Suggested Post</label>
                     <p className="ai-post-text">{aiGeneratedPost}</p>
                     <button type="button" onClick={() => { setFormData(prev => ({ ...prev, caption: aiGeneratedPost })); setIsPostConfirmed(true); }} className="confirm-button">
                         Confirm Post ✅
                     </button>
                     <button type="button" onClick={handleGeneratePost} disabled={isLoading} className="refresh-button">
                         {isLoading ? "Refreshing..." : "Try Another 🔄"}
                     </button>
                 </div>
             )}
          </div>

          


          {/* Budget & Duration */}
          <div className="form-row">
            <div className="form-group form-row-item">
              <label htmlFor="budget">Budget ($)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 50"
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
                placeholder="e.g., 7"
                className="create-campaign-input"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="submit-container">
            <button type="submit" className="create-campaign-submit" disabled={isLoading}>
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;

