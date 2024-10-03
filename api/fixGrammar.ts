import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiUrl = process.env.WORDWARE_API_URL; 
  const apiKey = process.env.WORDWARE_API_KEY; 

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

    const requestBody = {
      inputs: {
        manuscript: manuscript
      },
      version: "^1.0"
    };

    console.log('Sending request with body:', JSON.stringify(requestBody));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Use your API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Send the correct body
    });

    if (!response.ok) {
      const errorText = await response.text(); // Log the full error message from Wordware
      console.log('Error response from Wordware API:', errorText);
      throw new Error(`Wordware API Error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data); // Return the Wordware response back to the frontend
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in fixGrammar API:', error.message);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
