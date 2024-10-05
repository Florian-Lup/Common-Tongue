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
      version: "^1.2"
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Invalid response from Wordware API: ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    let responseBody = '';

    // If the response is streamed in chunks, handle it
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { done: readerDone, value } = await reader.read();
        done = readerDone;
        responseBody += decoder.decode(value, { stream: !readerDone });
      }
    } else {
      // Fallback for non-streamed responses
      responseBody = await response.text();
    }

    console.log('Full response body:', responseBody);

    // If the content-type is JSON, attempt to parse it
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = JSON.parse(responseBody);
        return res.status(200).json(data);  // Send the parsed JSON to the client
      } catch (error) {
        console.error('Failed to parse JSON response:', error);
        return res.status(500).json({
          error: 'Failed to parse JSON response from Wordware API',
          details: responseBody,  // Send raw response to client for debugging
        });
      }
    } else {
      // If the response is not JSON, return the raw text
      return res.status(200).send(responseBody);  // Send raw text response to client
    }

  } catch (error) {
    console.error('Error in fixGrammar API:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
