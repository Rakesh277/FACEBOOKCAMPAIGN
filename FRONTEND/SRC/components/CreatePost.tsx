import { useState } from 'react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [campaignId, setCampaignId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, imageUrl, campaignId }),
      });

      const data = await res.json();
      alert(`Post created: ${data._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Post content"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="text"
        value={campaignId}
        onChange={e => setCampaignId(e.target.value)}
        placeholder="Campaign ID"
        className="border p-2 mb-4 w-full"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;