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

    let responseBody = '';
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    // Collect all chunks
    let done = false;
    while (!done && reader) {
      const { done: readerDone, value } = await reader.read();
      done = readerDone;
      responseBody += decoder.decode(value, { stream: !readerDone });
    }

    console.log('Full response body:', responseBody);  // Log full response for diagnostics

    // Attempt to parse the full response body as JSON
    let finalRevision = null;
    try {
      const parsedResponse = JSON.parse(responseBody);
      if (parsedResponse.value && parsedResponse.value.finalRevision) {
        finalRevision = parsedResponse.value.finalRevision;
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(500).json({ error: 'Error parsing JSON response', details: responseBody });
    }

    if (finalRevision) {
      return res.status(200).json({ finalRevision });
    } else {
      return res.status(500).json({
        error: 'finalRevision field not found in response',
        details: responseBody,
      });
    }

  } catch (error) {
    console.error('Error in fixGrammar API:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
