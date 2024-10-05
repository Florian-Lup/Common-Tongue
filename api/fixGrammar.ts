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
      version: "^1.1"
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

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let finalRevision = '';
    let finalRevisionStarted = false;
    let buffer = '';

    while (!done && reader) {
      const { done: readerDone, value } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: !readerDone });
      buffer += chunk;

      // Use a regular expression to extract complete JSON objects
      const regex = /(\{[^]*?\})(?=\s*\{|\s*$)/g;
      let match;
      while ((match = regex.exec(buffer)) !== null) {
        const jsonString = match[1];
        try {
          const parsedChunk = JSON.parse(jsonString);

          // Handle the parsing logic based on the content
          if (parsedChunk.value) {
            if (parsedChunk.value.label === 'finalRevision' && parsedChunk.value.state === 'start') {
              finalRevisionStarted = true;
            } else if (parsedChunk.value.type === 'chunk' && finalRevisionStarted) {
              if (parsedChunk.value.value) {
                finalRevision += parsedChunk.value.value;
              }
            } else if (parsedChunk.value.label === 'finalRevision' && parsedChunk.value.state === 'done') {
              finalRevisionStarted = false;
            }
          }
        } catch (error) {
          console.log('Skipping invalid JSON chunk:', jsonString);
        }
      }

      // Remove processed parts from the buffer
      buffer = buffer.slice(regex.lastIndex);
      regex.lastIndex = 0; // Reset regex index
    }

    if (finalRevision) {
      return res.status(200).json({ finalRevision: finalRevision.trim() });
    } else {
      console.log('Full response body:', buffer);
      return res.status(500).json({
        error: 'finalRevision field not found in response',
        details: buffer,  // Send raw response for debugging (optional)
      });
    }

  } catch (error) {
    console.error('Error in fixGrammar API:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
