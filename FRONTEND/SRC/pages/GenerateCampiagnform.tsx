import { useState } from 'react';
import axios from 'axios';

const GenerateCampaignForm = () => {
  const [formData, setFormData] = useState({
    campaignName: '',
    objective: '',
    description: '',
    audience: {
      minAge: 18,
      maxAge: 45,
      gender: 'All',
      location: '',
      interests: [],
      language: 'English'
    },
    adType: 'Image + Caption'
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        [name]: name === 'interests' ? value.split(',') : value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-campaign', formData);
      setResult(response.data.content);
    } catch (error) {
      console.error('Error generating campaign:', error);
      setResult('❌ Failed to generate campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Generate Facebook Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="campaignName" placeholder="Campaign Name" onChange={handleChange} className="w-full p-2 border" />
        <input name="objective" placeholder="Objective" onChange={handleChange} className="w-full p-2 border" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border" />
        <input name="location" placeholder="Location" onChange={handleAudienceChange} className="w-full p-2 border" />
        <input name="interests" placeholder="Interests (comma-separated)" onChange={handleAudienceChange} className="w-full p-2 border" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Generating...' : 'Generate Campaign'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Generated Campaign Content:</h3>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default GenerateCampaignForm;