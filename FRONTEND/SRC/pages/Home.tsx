import React from 'react';
import Dashboard from '../components/Dashboard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">📊 Welcome to Your Campaign Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage posts, track analytics, and launch new campaigns with ease.
          </p>
        </header>

        <section className="bg-white shadow rounded-lg p-6">
          <Dashboard />
        </section>
      </div>
    </div>
  );
};

export default Home;