import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { manuscript } = req.body;

  if (!manuscript) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const requestBody = {
    inputs: {
      manuscript
    },
    version: '^1.0'
  };

  try {
    const response = await fetch(process.env.WORDWARE_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORDWARE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fix grammar');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fixing grammar:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unhandled error type:', typeof error);
    }
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}