import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Validate API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY in environment variables');
}

// Create OpenAI client
const openai = new OpenAI({ apiKey });

export default openai;