import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body;

  try {
    const response = await axios.post(
      process.env.VITE_GRAMMAR_API_URL || '',
      {
        inputs: {
          manuscript: text
        },
        version: "^1.0"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_GRAMMAR_API_KEY}`
        }
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fixing grammar:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}