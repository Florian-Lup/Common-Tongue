import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('fixGrammar API handler called');
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { inputs } = req.body;
  console.log('Inputs:', inputs);

  if (!inputs || !inputs.manuscript) {
    console.error('Missing manuscript in request body');
    return res.status(400).json({ message: 'Manuscript is required' });
  }

  try {
    const apiUrl = process.env.WORDWARE_API_URL!;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORDWARE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {
          manuscript: inputs.manuscript
        },
        version: '^1.0'
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}