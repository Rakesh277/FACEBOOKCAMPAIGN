import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies/tokens
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Assuming you store the token here after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interface to define the structure of campaign data for creation
export interface NewCampaignData {
  name: string;
  objective: string;
  adAccountId: string;
  status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  // Add other fields as needed
}

// Function to fetch all campaigns for the logged-in user
export const getCampaigns = async () => {
  const { data } = await api.get('/campaigns');
  return data;
};

// Function to create a new campaign
export const createCampaign = async (campaignData: NewCampaignData) => {
  const { data } = await api.post('/campaigns', campaignData);
  return data;
};

// You can add these later for update and delete functionality
// export const updateCampaign = async (id: string, updates: Partial<NewCampaignData>) => { ... };
// export const deleteCampaign = async (id: string) => { ... };
