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

    console.log('Sending request to Wordware API with body:', JSON.stringify(requestBody));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Capture the response text
    const responseText = await response.text();
    console.log('Raw response from Wordware API:', responseText);

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      // Handle invalid response statuses
      throw new Error(`Invalid response from Wordware API: ${response.statusText} - ${responseText}`);
    }

    // Check if the response is JSON, otherwise return as text
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = JSON.parse(responseText);
        res.status(200).json(data);  // Return the parsed JSON to the client
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        res.status(500).json({
          error: 'Failed to parse the response from Wordware API',
          details: responseText,  // Send raw response for further debugging
        });
      }
    } else {
      // If the response is not JSON, return the plain text
      res.status(200).send(responseText);  // Send raw text response to the client
    }

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
