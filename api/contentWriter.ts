import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiUrl = process.env.WORDWARE_API_URL;
  const apiKey = process.env.WORDWARE_API_KEY;

  if (!apiUrl) {
    return res
      .status(500)
      .json({ error: 'WORDWARE_API_URL is not defined in environment variables.' });
  }

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'WORDWARE_API_KEY is not defined in environment variables.' });
  }

  try {
    const { contentRequest } = req.body.inputs;

    if (!contentRequest) {
      return res.status(400).json({ message: 'Missing contentRequest field' });
    }

    const requestBody = {
      inputs: { contentRequest },
      version: '^1.0',
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Invalid response from Wordware API: ${response.statusText} - ${errorText}`
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let buffer = '';
    let newContent = '';
    let writerAgentActive = false;
    let newContentStarted = false;

    while (!done && reader) {
      const { done: readerDone, value } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: !readerDone });
      buffer += chunk;

      // Use a regex to extract complete JSON objects
      const regex = /(\{[^]*?\})(?=\s*\{|\s*$)/g;
      let match;
      let lastProcessedIndex = 0;

      while ((match = regex.exec(buffer)) !== null) {
        const jsonString = match[1];
        const matchEndIndex = regex.lastIndex;
        try {
          const parsedChunk = JSON.parse(jsonString);

          // Handle the parsing logic based on the content
          if (parsedChunk.value) {
            // Check if we're entering the AI Writer Agent
            if (
              parsedChunk.value.type === 'prompt' &&
              parsedChunk.value.state === 'start' &&
              parsedChunk.value.path === 'AI Writer Agent'
            ) {
              writerAgentActive = true;
            }

            // Check if we're exiting the AI Writer Agent
            else if (
              parsedChunk.value.type === 'prompt' &&
              parsedChunk.value.state === 'complete' &&
              parsedChunk.value.path === 'AI Writer Agent'
            ) {
              writerAgentActive = false;
            }

            // Start of newContent within the AI Writer Agent
            else if (
              writerAgentActive &&
              parsedChunk.value.label === 'newContent' &&
              parsedChunk.value.state === 'start'
            ) {
              newContentStarted = true;
            }

            // End of newContent within the AI Writer Agent
            else if (
              writerAgentActive &&
              parsedChunk.value.label === 'newContent' &&
              parsedChunk.value.state === 'done'
            ) {
              newContentStarted = false;
            }

            // Accumulate newContent text
            else if (
              writerAgentActive &&
              newContentStarted &&
              parsedChunk.value.type === 'chunk' &&
              parsedChunk.value.value
            ) {
              newContent += parsedChunk.value.value;
            }
          }
        } catch (error) {
          console.error('Skipping invalid JSON chunk:', jsonString);
        }
        // Update lastProcessedIndex to the end of the current match
        lastProcessedIndex = matchEndIndex;
      }

      // Remove processed data from the buffer
      buffer = buffer.slice(lastProcessedIndex);
    }

    if (newContent) {
      return res.status(200).json({ newContent: newContent.trim() });
    } else {
      console.error('Full response buffer:', buffer);
      return res.status(500).json({
        error: 'newContent from AI Writer Agent not found in response',
        details: buffer, // Send raw response for debugging
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in AI Writer API:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      console.error('Unknown error in AI Writer API:', error);
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}
