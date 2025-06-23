import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// Initialize OpenAI client on the server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get transcript from request body
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'No transcript provided' });
  }

  try {
    const prompt = `Analyze this transcript and extract:
    1. Core values (4-5 key values)
    2. Interests mentioned
    3. Communication style
    4. Personality traits
    5. Social preferences
    6. Humor style
    
    Transcript: "${transcript}"
    
    Return as JSON with these exact keys:
    {
      "core_values": [],
      "interests": [],
      "communication_style": "",
      "emotional_patterns": "",
      "social_preferences": "",
      "humor_style": "",
      "energy_type": ""
    }`;

    // Make the OpenAI API call from the server
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a personality analyst. Analyze transcripts to understand personality.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });

    // Parse and return the response
    const data = JSON.parse(response.choices[0].message.content || '{}');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ 
      error: 'Error processing your request',
      message: error.message 
    });
  }
} 