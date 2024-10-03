import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("API handler called");
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);

  if (req.method !== 'POST') {
    console.log("Method not allowed");
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { manuscript } = req.body;

  if (!manuscript) {
    console.log("Text is required");
    return res.status(400).json({ message: 'Text is required' });
  }

  const requestBody = {
    inputs: {
      manuscript
    },
    version: '^1.0'
  };

  console.log("Request body to Wordware API:", JSON.stringify(requestBody));

  try {
    const apiUrl = process.env.WORDWARE_API_URL;
    const apiKey = process.env.WORDWARE_API_KEY;
    console.log("Wordware API URL:", apiUrl);

    if (!apiUrl || !apiKey) {
      console.error("API URL or API Key is not defined in environment variables.");
      throw new Error("API URL or API Key is not defined in environment variables.");
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Wordware API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from Wordware API:', errorText);
      throw new Error('Failed to fix grammar');
    }

    const data = await response.json();
    console.log("Wordware API response data:", data);
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