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

  console.log('Selected text:', manuscript);
  console.log('Request body:', JSON.stringify(requestBody));

  try {
    const response = await fetch(process.env.WORDWARE_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORDWARE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fix grammar');
    }

    const data = await response.json();
    console.log('Grammar suggestions:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fixing grammar:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}