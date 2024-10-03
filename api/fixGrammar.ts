import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiUrl = process.env.WORDWARE_API_URL; // Securely stored in Vercel environment
  const apiKey = process.env.WORDWARE_API_KEY; // Securely stored in Vercel environment

  // Check if the apiUrl or apiKey is undefined
  if (!apiUrl) {
    return res.status(500).json({ error: 'WORDWARE_API_URL is not defined in environment variables.' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'WORDWARE_API_KEY is not defined in environment variables.' });
  }

  try {
    const { manuscript } = req.body.inputs;

    if (!manuscript) {
      return res.status(400).json({ message: 'Missing manuscript field' });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Securely include the API key here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manuscript: manuscript,  // Forward the manuscript from the request
      }),
    });

    if (!response.ok) {
      throw new Error(`Wordware API Error: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);  // Return the API response back to the frontend
  } catch (error) {
    console.error('Error in fixGrammar API:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
