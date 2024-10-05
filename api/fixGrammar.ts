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
      inputs: { manuscript },
      version: "^1.3"
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

    console.log('Full response body:', responseBody);

    // Split the response into individual chunks, and handle them separately
    const chunks = responseBody.split('} {').map((chunk, index, array) => {
      if (index === 0) return chunk + '}';
      if (index === array.length - 1) return '{' + chunk;
      return '{' + chunk + '}';
    });

    let finalRevision = null;

    // Parse each chunk and extract the finalRevision
    chunks.forEach((chunk) => {
      try {
        const parsedChunk = JSON.parse(chunk);
        if (parsedChunk.value && parsedChunk.value.finalRevision) {
          finalRevision = parsedChunk.value.finalRevision;
        }
      } catch (error) {
        console.log('Skipping non-JSON chunk:', chunk);
      }
    });

    if (finalRevision) {
      return res.status(200).json({ finalRevision });
    } else {
      return res.status(500).json({
        error: 'finalRevision field not found in response',
        details: responseBody,  // Send raw response for debugging (optional)
      });
    }

  } catch (error) {
    console.error('Error in fixGrammar API:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
