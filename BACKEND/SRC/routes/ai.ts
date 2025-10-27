// In BACKEND/src/routes/ai.ts
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai/generate-caption
router.post('/generate-caption', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Generate a short, engaging Facebook post caption for a campaign about: "${prompt}"` }],
    });
    
    const caption = completion.choices[0].message.content;
    res.json({ caption });
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed' });
  }
});

export default router;
