import { Request, Response } from 'express';
import { getPostFromAI } from '../services/aiService';

export const generatePost = async (req: Request, res: Response) => {
  try {
    const { caption, budget, duration } = req.body;
    const post = await getPostFromAI({ caption, budget, duration });
    res.json({ post });
  } catch (error) {
    console.error('Post generation failed:', error);
    res.status(500).json({ message: 'AI generation failed' });
  }
};