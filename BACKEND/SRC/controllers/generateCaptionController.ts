import { Request, Response } from 'express';
import { getCaptionFromAI } from '../services/aiService';

export const generateCaption = async (req: Request, res: Response) => {
  try {
    const { objective, adType, description } = req.body;
    const caption = await getCaptionFromAI({ objective, adType, description });
    res.json({ caption });
  } catch (error) {
    console.error('Caption generation failed:', error);
    res.status(500).json({ message: 'AI generation failed' });
  }
};