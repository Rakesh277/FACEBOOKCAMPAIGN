import axios from 'axios';
import { CaptionInput, PostInput } from '../types/ai'; // adjust path if needed

export const getCaptionFromAI = async ({ objective, adType, description }: CaptionInput): Promise<{ caption: string }> => {
  const prompt = `Create a Facebook ad caption for a ${objective} campaign using a ${adType}. Description: ${description}`;
  const response = await axios.post('https://your-ai-endpoint.com/generate', { prompt });
  return { caption: response.data.caption };
};

export const getPostFromAI = async ({ caption, budget, duration }: PostInput): Promise<{ post: string }> => {
  const prompt = `Generate a full Facebook post using this caption: "${caption}". Budget: $${budget}, Duration: ${duration} days.`;
  const response = await axios.post('https://your-ai-endpoint.com/generate', { prompt });
  return { post: response.data.post };
};