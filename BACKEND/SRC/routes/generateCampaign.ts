import express from 'express';
import openai from '../config/openaiConfig';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      campaignName,
      objective,
      description,
      audience,
      adType
    } = req.body;

    const prompt = `
Create a Facebook ad campaign for "${campaignName}".
Objective: ${objective}
Description: ${description}
Target Audience:
- Age: ${audience.minAge} to ${audience.maxAge}
- Gender: ${audience.gender}
- Location: ${audience.location}
- Interests: ${audience.interests.join(', ')}
- Language: ${audience.language}
Ad Type: ${adType}
Generate a caption, post copy, and suggest media.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    const aiOutput = response.choices[0].message.content;

    res.status(200).json({ success: true, content: aiOutput });
  } catch (error) {
    console.error('❌ Error generating campaign:', error);
    res.status(500).json({ success: false, message: 'Failed to generate campaign' });
  }
});

export default router;