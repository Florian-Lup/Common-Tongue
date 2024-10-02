import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const response = await axios.post(
      process.env.VITE_WORDWARE_API_URL as string,
      {
        inputs: {
          manuscript: text
        },
        version: '^1.0'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_WORDWARE_API_KEY}`
        }
      }
    );

    const correctedText = response.data.finalRevision;

    res.status(200).json({ correctedText });
  } catch (error) {
    console.error('Error fixing grammar:', error);
    res.status(500).json({ message: 'An error occurred while fixing grammar' });
  }
}