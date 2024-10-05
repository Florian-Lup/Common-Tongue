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

    // Build the request body to match the expected structure
    const requestBody = {
      inputs: {
        manuscript: manuscript
      },
      version: "^1.0"
    };

    console.log('Sending request with body:', JSON.stringify(requestBody));

    // Send the request to the Wordware API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Use your API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Ensure proper JSON formatting
    });

    // Log and capture the response text
    const responseText = await response.text();
    console.log('Response from Wordware API:', responseText);

    if (!response.ok) {
      throw new Error(`Wordware API Error: ${response.statusText} - ${responseText}`);
    }

    // Parse the response JSON if the response is valid
    const data = JSON.parse(responseText);
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
