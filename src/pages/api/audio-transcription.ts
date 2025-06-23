import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import formidable from 'formidable';
import fs from 'fs';

// Initialize OpenAI client on the server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    // Get the audio file
    const file = Array.isArray(files.file) ? files.file[0] : undefined;
    
    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Make the OpenAI API call from the server
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(file.filepath),
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word', 'segment']
    });

    // Return the response
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('OpenAI Audio API error:', error);
    return res.status(500).json({ 
      error: 'Error processing your request',
      message: error.message 
    });
  }
} 