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

  const { manuscript } = req.body.inputs;

  if (!manuscript) {
    console.log("Manuscript text is required");
    return res.status(400).json({ message: 'Manuscript text is required' });
  }

  const requestBody = {
    inputs: {
      manuscript
    },
    version: '^1.0'
  };

  console.log("Request body to Wordware API:", JSON.stringify(requestBody));

  try {
    const apiUrl = process.env.VITE_WORDWARE_API_URL; // Updated to match .env.local variable name
    const apiKey = process.env.VITE_WORDWARE_API_KEY; // Updated to match .env.local variable name
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
    console.error('Error fixing grammar:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}