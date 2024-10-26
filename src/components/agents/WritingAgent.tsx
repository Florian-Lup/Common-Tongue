// agents/WritingAgent.ts
import { Editor } from '@tiptap/react';
import "./agentstyle.scss";

export const WritingAgent = async (
  editor: Editor,
  prompt: string,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!prompt.trim()) {
    setErrorMessage('Please provide a prompt.');
    // Remove the error message after 3 seconds
    setTimeout(() => setErrorMessage(null), 3000);
    return;
  }

  try {
    setIsProcessing(true);
    const { to, empty, head } = editor.state.selection;
    const position = empty ? head : to; // Insert at cursor if selection is empty, else at end of selection

    // Send the prompt to the API
    const response = await fetch('/api/contentWriter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: { contentRequest: prompt },
        version: '^1.3',
      }),
    });

    const data = await response.json();

    if (response.ok && data.newContent) {
      // Insert the generated content into the editor with typewriter effect
      typeWriterEffect(editor, position, data.newContent, setIsTyping);
    } else {
      console.error('API Error:', data.error || 'Unknown error');
      setErrorMessage('An error occurred.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  } catch (err) {
    console.error('Submission error:', err);
    setErrorMessage('An error occurred.');
    setTimeout(() => setErrorMessage(null), 3000);
  } finally {
    setIsProcessing(false);
  }
};

const typeWriterEffect = (
  editor: Editor,
  from: number,
  text: string,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsTyping(true);

  let index = 0;
  const length = text.length;

  const interval = setInterval(() => {
    if (index < length) {
      const char = text.charAt(index);
      editor.commands.insertContentAt(from + index, char);
      index++;
    } else {
      clearInterval(interval);
      setIsTyping(false);
      // Set the cursor position after the inserted text
      editor.commands.setTextSelection(from + length);
    }
  }, 10); // Typewriter speed
};
