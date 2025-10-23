import React, { useState } from 'react';

const CreatePost: React.FC = () => {
  const [scheduledAt, setScheduledAt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scheduled post at:', scheduledAt);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="scheduledAt" className="block mb-1 font-medium">
            Schedule Date & Time
          </label>
          <input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            placeholder="Select date and time"
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Generate & Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;