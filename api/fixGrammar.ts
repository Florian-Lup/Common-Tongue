import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("API handler called for fixing grammar");
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);

  if (req.method !== 'POST') {
    console.log("Method not allowed for fixing grammar");
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { manuscript } = req.body;

  if (!manuscript) {
    console.log("Text is required for grammar fixing");
    return res.status(400).json({ message: 'Text is required' });
  }

  const apiUrl = process.env.WORDWARE_API_URL;
  const apiKey = process.env.WORDWARE_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error('API URL or API Key is not defined for grammar fixing');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: { manuscript },
        version: '^1.0'
      }),
    });

    console.log("Response status from Wordware API for grammar fixing:", response.status);

    if (!response.ok) {
      throw new Error('Failed to fix grammar');
    }

    const data = await response.json();
    console.log("Grammar suggestion received from Wordware API:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fixing grammar:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}