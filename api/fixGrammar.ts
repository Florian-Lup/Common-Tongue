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

    // Build the request body
    const requestBody = {
      inputs: {
        manuscript: manuscript
      },
      version: "^1.0"
    };

    console.log('Sending request to Wordware API with body:', JSON.stringify(requestBody));

    // Send request to Wordware API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Ensure the request body is correctly formatted
    });

    // Capture and log the raw response text from the Wordware API
    const responseText = await response.text();
    console.log('Raw response from Wordware API:', responseText);

    // Handle the case where the response is not OK or not JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid response from Wordware API: ${response.statusText} - ${responseText}`);
    }

    // Parse the response as JSON and return it to the client
    const data = JSON.parse(responseText);
    res.status(200).json(data); // Send the parsed data back to the client

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in fixGrammar API:', error.message);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      console.error('Unknown error in fixGrammar API:', error);
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
