import React, { useState } from "react";
import axios from "axios";

const PostGenerator: React.FC = () => {
  const [postText, setPostText] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/posts/generate", { caption });
      setPostText(response.data.generatedText);
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    const formData = new FormData();
    formData.append("postText", postText);
    formData.append("caption", caption);
    formData.append("scheduleTime", scheduleTime);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("/api/posts/schedule", formData);
      alert("Post scheduled successfully!");
      setPostText("");
      setCaption("");
      setImage(null);
      setScheduleTime("");
    } catch (error) {
      console.error("Error scheduling post:", error);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Post Generator</h2>

      <label htmlFor="postText" className="block mb-1 font-medium">
        Post Text
      </label>
      <textarea
        id="postText"
        title="Enter the main content of your post"
        placeholder="Write your post here..."
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        rows={4}
      />

      <label htmlFor="caption" className="block mb-1 font-medium">
        Caption
      </label>
      <input
        id="caption"
        type="text"
        title="Enter a caption for your post"
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <label htmlFor="imageUpload" className="block mb-1 font-medium">
        Upload Image
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        title="Upload an image for your post"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <label htmlFor="scheduleTime" className="block mb-1 font-medium">
        Schedule Time
      </label>
      <input
        id="scheduleTime"
        type="datetime-local"
        title="Select a date and time to schedule your post"
        value={scheduleTime}
        onChange={(e) => setScheduleTime(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate with AI
        </button>
        <button
          onClick={handleSchedule}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Schedule Post
        </button>
      </div>
    </section>
  );
};

export default PostGenerator;