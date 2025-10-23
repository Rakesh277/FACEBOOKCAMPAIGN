import { useState, useEffect } from 'react';

interface Campaign {
  _id: string;
  name: string;
  posts: any[];
}

export const useCampaignData = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now
    setTimeout(() => {
      setCampaigns([
        { _id: '1', name: 'Summer Campaign', posts: [] },
        { _id: '2', name: 'Holiday Special', posts: [] }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { campaigns, loading };
};
