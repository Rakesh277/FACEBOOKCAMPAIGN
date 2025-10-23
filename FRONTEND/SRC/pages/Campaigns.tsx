import React from 'react';
import Layout from '@components/layout/Layout';
import { useCampaignData } from '../utils/hooks/useCampaignData';

interface Campaign {
  _id: string;
  name: string;
  posts?: { _id: string }[];
  platform?: string;
}

const Campaigns: React.FC = () => {
  const { campaigns, loading } = useCampaignData();

  if (loading)
    return (

        <p className="p-6 text-lg text-white">Loading campaigns...</p>

    );

  return (
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>

        {campaigns.length === 0 ? (
          <p className="text-gray-400">No campaigns found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(campaigns as Campaign[]).map((c) => (
              <div
                key={c._id}
                className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg hover:bg-gray-700 transition"
              >
                <h2 className="text-xl font-semibold mb-2">{c.name}</h2>
                <p className="text-sm text-gray-300 mb-1">
                  Posts: {c.posts?.length ?? 0}
                </p>
                {c.platform && (
                  <span className="inline-block bg-teal-600 text-white text-xs px-2 py-1 rounded">
                    {c.platform}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

  );
};

export default Campaigns;