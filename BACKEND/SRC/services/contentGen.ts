import openai from '../config/openaiConfig';

export const generatePostContent = async (): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a social media expert. Generate engaging Facebook post content for marketing campaigns.',
        },
        {
          role: 'user',
          content: 'Create a compelling Facebook post for a marketing campaign.',
        },
      ],
      max_tokens: 150,
    });

    const message = response.choices?.[0]?.message?.content;
    return message?.trim() || 'Generated post content';
  } catch (error) {
    console.error('❌ Error generating content:', error);
    return '⚠️ Sample post content - AI generation failed';
  }
};