import React from "react";
import Layout from "@components/layout/Layout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Analytics: React.FC = () => {
  // Sample data for charts
  const campaignPerformance = [
    { name: "Week 1", impressions: 4000, clicks: 240, conversions: 30 },
    { name: "Week 2", impressions: 6000, clicks: 320, conversions: 42 },
    { name: "Week 3", impressions: 7500, clicks: 410, conversions: 58 },
    { name: "Week 4", impressions: 9000, clicks: 500, conversions: 72 },
  ];

  const audienceInsights = [
    { name: "18-24", engagement: 65 },
    { name: "25-34", engagement: 80 },
    { name: "35-44", engagement: 55 },
    { name: "45-54", engagement: 40 },
  ];

  return (

      <div className="p-8 text-white max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-teal-400">
          Campaign Analytics
        </h2>

        {/* Campaign Performance Section */}
        <div className="mb-10 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Campaign Performance Overview
          </h3>
          <p className="text-gray-400 mb-4">
            Track weekly impressions, clicks, and conversions.
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                }}
              />
              <Legend />
              <Bar dataKey="impressions" fill="#14b8a6" />
              <Bar dataKey="clicks" fill="#60a5fa" />
              <Bar dataKey="conversions" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Insights Section */}
        <div className="mb-10 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Audience Insights</h3>
          <p className="text-gray-400 mb-4">
            Understand engagement trends by age group.
          </p>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={audienceInsights}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">💡 AI Recommendations</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              Boost engagement by scheduling more posts between 6–9 PM.
            </li>
            <li>
              Your audience aged 25–34 shows highest interaction — increase
              targeting in that range.
            </li>
            <li>Try using carousel ads — they’ve shown 12% higher CTR.</li>
            <li>
              Optimize creatives weekly to reduce ad fatigue and increase ROI.
            </li>
          </ul>
        </div>
      </div>
   
  );
};

export default Analytics;
